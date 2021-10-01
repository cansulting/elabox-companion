const { exec } = require('child_process');
const fs = require('fs');
const tempFile = "/sys/class/thermal/thermal_zone0/temp"
const syslog = require("../logger")
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
    syslog.write(syslog.create().debug(`Fan toggled ${toggle}`))
    fanOut.writeSync(toggle)
}

// use to automatically control fan. 
// @defaultValue if not null thenn toggle by specific value
const fanControl = (defaultValue = null) => {
     return new Promise((resolve, reject) => {
         try {
            if (defaultValue !== null) {
                toggleFan(defaultValue)
                return
            }
            if (!isAvailable()) {
                reject("Temperature access not available")
                return
            }
            exec('cat ' + tempFile, { maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {

                if (err) {
                    syslog.write(syslog.create().error(`Fan error`, err).addCaller())
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
            syslog.write(syslog.create().error(`Fan control error`, err).addCaller())
            reject(err)
        }
     })
 }

module.exports = fanControl