const syslog = require("../logger");
const { exec } = require("child_process"); 
const config = require("../config")
const maxBufferSize = 10000;

function validCharacters(str = "") {
    if (!str || str.length <= 5) return false
    if (str.search(' ') >= 0) return false;

    const specialChars = /[`^&()\[\]{};:\\|,.<>\/]/;
    return !specialChars.test(str);
}

function changePassword(pwd) {
    return new Promise( (resolve, rej) => {
        if (!validCharacters(pwd)) {
            rej(Error('password shouldnt contain special characters with atleas 6 characters.'))
            return
        }   
        exec(
            "echo 'elabox:" + pwd + "' | sudo chpasswd",
            { maxBuffer: 1024 * maxBufferSize },
            (err, stdout, stderr) => {
                syslog.write(syslog.create().debug("Updating Raspberry PI password"));
                if (!stdout) {
                    syslog.write(
                        syslog.create().debug("Success updating RPI password " + stdout)
                    );
                }
                if (err) {
                    syslog.write(
                        syslog
                        .create()
                        .error("Error while updating RPI password", err)
                        .addCaller()
                    );
                    rej(err)
                    return
                }
                if (stderr) {
                    syslog.write(
                        syslog
                        .create()
                        .error("Error while updating RPI password.", stderr)
                        .addCaller()
                    );
                    rej(err)
                    return
                }
                resolve(200)
            }
        );
    })
}

function generateKeystore(pwd, replaceOld = false) {
    return new Promise( (resolve, rej) => {
        if (!validCharacters(pwd)) {
            rej(Error('password shouldnt contain special characters and with atleast 8 characters.'))
            return
        }     
        let cmd = "cd " +
            config.ELADATA_DIR +
            "; " +
            config.ELA_DIR +
            "/ela-cli wallet create -p " +
            pwd +
            "";
        if (replaceOld) {
            cmd = "cd " +
                config.ELADATA_DIR +
                "; rm keystore.dat; " +
                config.ELA_DIR +
                "/ela-cli wallet create -p " +
                pwd +
                "";
        }
        console.log(cmd)
        exec(
            cmd,
            { maxBuffer: 1024 * maxBufferSize },
            (err, stdout, stderr) => {
                if (stderr) {
                    syslog.write(
                        syslog
                        .create()
                        .error("Error while updating RPI password.", stderr)
                        .addCaller()
                    );
                }
                if (err) {
                    syslog.write(
                        syslog.create().error("Error while creating wallet", err).addCaller()
                    );
                    rej(err)
                } else {
                    syslog.write(
                        syslog.create().debug("Success creating wallet " + stdout)
                    );
                    resolve(200)
                }
            });
        }
    );
}

function authenticate(pwd) {
    return new Promise((resolve, reject) => {
        if (!validCharacters(pwd)) {
            reject(Error('invalid password'))
            return
        }

        exec(
            config.ELA_DIR +
              "/ela-cli wallet a -w " +
              config.KEYSTORE_PATH +
              " -p " +
              pwd +
              "",
            { maxBuffer: 1024 * maxBufferSize },
            async (err, stdout, stderr) => {
              if (stdout)
                syslog.write(syslog.create().debug("/login request " + stdout));
              if (err) {
                syslog.write(
                  syslog
                    .create()
                    .error("Error on /login. Failed ela cli exec.", err)
                    .addCaller()
                );
                reject(Error('unable to authenticate password.'))
              } else {
                resolve(stdout.split("\n")[2].split(" ")[0]);
              }
            }
        );
    })
}

module.exports = {
    generateKeystore: generateKeystore,
    changePassword: changePassword,
    validCharacters: validCharacters,
    authenticate: authenticate,
}