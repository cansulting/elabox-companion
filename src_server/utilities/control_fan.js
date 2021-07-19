const { exec } = require('child_process');
let fanOut = null

const fanControl = () => {
     return new Promise((resolve, reject) => {
         try {
            // init fan ios
            // set BCM 4 pin as 'output'
            if (!fanOut) {
                const { Gpio } = require('onoff');
                fanOut = new Gpio('4', 'out');
            }

            exec('cat /sys/class/thermal/thermal_zone0/temp', { maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
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