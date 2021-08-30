const { exec } = require('child_process');
const fs = require('fs');
const tempFile = "/sys/class/thermal/thermal_zone0/temp"
let fanOut = null
const pin = '14'

const isAvailable = () => {
    return fs.existsSync(tempFile)
}

const toggleFan = (toggle = 1) => {
    // init fan ios
    // set BCM 4 pin as 'output'
    if (!fanOut) {
        const { Gpio } = require('onoff');
        fanOut = new Gpio(pin, 'out');
    }
    console.log("Fan Toggled", toggle)
    fanOut.writeSync(toggle)
}

// use to automatically control fan. 
// @defaultValue if not null thenn toggle by specific value
const fanControl = (defaultValue = null) => {
     return new Promise((resolve, reject) => {
         try {
            if (defaultValue !== null) {
                toogleFan(defaultValue)
                return
            }
            if (!isAvailable()) {
                reject("Temperature access not available")
                return
            }
            exec('cat ' + tempFile, { maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
                console.log(stdout)
                if (err) {
                    console.log("FAN ERROR", err)
                    reject(err)
                }
                if (stdout > 60000) {
                    toggleFan(1)
                    resolve()
                }
                else {
                    toggleFan(0)
                    resolve()
                }
            });
        }catch(err) {
            reject(err)
        }
     })
 }

module.exports = fanControl