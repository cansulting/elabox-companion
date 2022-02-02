const addSeconds=require("date-fns/addSeconds");
const differenceInSeconds = require('date-fns/differenceInSeconds');
const syslog = require("../logger");
const { exec } = require("child_process"); 
const config = require("../config")
const maxBufferSize = 10000;
//limiter
global.rateLimitRemaining = 0
global.currentRateLimit = 3;
global.currentWaitTime = 0.50;
const authLimiter= (res) =>{
    if(global.currentRateLimit===0){
        global.currentRateLimit=1;                  
        global.rateLimitRemaining=differenceInSeconds(addSeconds(new Date(),currentWaitTime*60),new Date()) 
        setInterval(()=>{
          if(global.rateLimitRemaining>0){
            global.rateLimitRemaining=global.rateLimitRemaining-1        
          }
        },1000)
        switch (global.currentWaitTime) {
          case 0.50:
            global.currentWaitTime=15;
            break;
          case 15:
            global.currentWaitTime=30;
            break;
          case 30:
            global.currentWaitTime=60;
            break;
          default:
                global.currentWaitTime=720;        
            break;
        }
        res.status(429).send( {err:"Too many auth request from this IP",ok:false})               
    }
}
function resetRateLimit(){
    global.currentWaitTime=0.50;
    global.currentRateLimit=3;            
}
//end limiter

function validCharacters(str = "") {
    if (!str || str.length <= 5) return false
    if (str.search(' ') >= 0) return false;

    const specialChars = /[`^$&()\'\"\[\]{};:\\|,.<>\/]/;
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
        //console.log(cmd)
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
        const cmd = config.ELA_DIR +
            "/ela-cli wallet a -w " +
            config.KEYSTORE_PATH +
            " -p " +
            pwd +
            ""
        //console.log(cmd)
        exec(
            cmd,
            { maxBuffer: 1024 * maxBufferSize },
            (err, stdout, stderr) => {
              //if (stdout)
              //  syslog.write(syslog.create().debug("/login request " + stdout));
              if (err || stderr) {
                err = err | stderr
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
    authLimiter: authLimiter,
    resetRateLimit: resetRateLimit
}