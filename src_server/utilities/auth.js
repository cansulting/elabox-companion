const addSeconds=require("date-fns/addSeconds");
const differenceInSeconds = require('date-fns/differenceInSeconds');
const syslog = require("../logger");
const { exec } = require("child_process"); 
const config = require("../config");
const maxBufferSize = 10000;
const specialChars = /[`^$&()\'\"\[\]{};:\\|,.<>\/]/; // characters that are considered invalid
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

    return !specialChars.test(str);
}

function changeSystemPassword(pwd) {
    return new Promise( (resolve, rej) => {
        if (!validCharacters(pwd)) {
            rej(Error('Password shouldnt contain special characters and space with atleast 6 characters.'))
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
            rej(Error('password shouldnt contain special characters and with atleast 6 characters.'))
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

// function that authenticates the user by checking ubuntu password
function authenticatePassword(pwd, username = 'elabox') {
    return new Promise(async (resolve, reject) => {
        if (!validCharacters(pwd)) {
            reject(Error('Invalid Password'))
            return
        }
        try {
            let result = await executeCommand("cat /etc/shadow | grep " + username, "Login")
            creds = result.split("$")
            const salt = creds[2]
            const hash = result.split(':')[1]
            //console.log(creds[1], creds[2], hash)
            const genHash = await executeCommand(`openssl passwd -${creds[1]} -salt ${salt} ${pwd}`)
            if (genHash.trim() === hash.trim()) {
                resolve(200)
            } else {
                reject(Error('Invalid Password'))
            }
        }catch (e) {
            reject(e)
        }
    })
}

function executeCommand(cmd, tag = "") { 
    return new Promise((resolve, reject) => {
        exec(cmd, { maxBuffer: 1024 * maxBufferSize }, (err, stdout, stderr) => {
            if (err || stderr) {
                err = err | stderr
                syslog.write(
                  syslog
                    .create()
                    .error(tag + " Exec command internal error.", err)
                    .addCaller()
                );
                reject(err)
              } else {
                resolve(stdout)
              }
        })
    })
}

module.exports = {
    generateKeystore: generateKeystore,
    changePassword: changeSystemPassword,
    validCharacters: validCharacters,
    authenticatePassword: authenticatePassword,
    authLimiter: authLimiter,
    resetRateLimit: resetRateLimit
}