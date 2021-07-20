const { exec } = require('child_process');
const fs = require('fs');
const tempFile = "/sys/class/thermal/thermal_zone0/temp"
let fanOut = null

const isAvailable = () => {
    return fs.existsSync(tempFile)
}

const fanControl = () => {
     return new Promise((resolve, reject) => {
         try {
            if (!isAvailable()) {
                reject("Temperature access not available")
                return
            }

            // init fan ios
            // set BCM 4 pin as 'output'
            if (!fanOut) {
                const { Gpio } = require('onoff');
                fanOut = new Gpio('4', 'out');
            }

            exec('cat ' + tempFile, { maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
                console.log(stdout)
                if (stdout > 70000) {
                    console.log("Starting fan")
                    fanOut.writeSync(1)
                    resolve()
                }
                else {
                    console.log("Stopping fan")
                    fanOut.writeSync(0)
                    resolve()
                }
                if (err) {
                    console.log("FAN ERROR", err)
                    reject(err)
                }
            });
        }catch(err) {
            reject(err)
        }
     })
 }

module.exports = fanControl