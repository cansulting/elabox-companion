var shell = require('shelljs');
const config = require("../config")
const syslog = require("../logger")

// check and update carrier IP if needed
const runCarrier = () => {
    syslog.write(syslog.create().debug("Running carrier script"))
    var prom = new Promise((resolve, reject) => {
      //shell.cd(config.BINARIES_PATH)
    
        shell.exec(
          "./check_carrier.sh",
          { maxBuffer: 1024 * 500 * 500 },
    
          (err, stdout, stderr) => {
            if (err || stderr) {
              syslog.write(syslog.create().error(`Failed carrier script`, err).addCaller())
              reject (err)
    
            } else {
              syslog.write(syslog.create().debug(stdout))
              syslog.write(syslog.create().debug(`Success running carrier script.`))
              resolve(stdout.trim())
            }
          }
        );
      
    });
    return prom
}

// check carrier IP address every 4 hours
const init = async () =>{ 
    runCarrier().then((_) => {
      setInterval(runCarrier, 1000 * 60 * 60 * 4)
    }).catch( err => {
      syslog.write(syslog.create().error(`Error runCarrier()`, err).addCaller())
    })
    
}

module.exports = {
    init: init
}