var shell = require('shelljs');
const config = require("../config")

// check and update carrier IP if needed
const runCarrier = () => {
    console.log("Running Check Carrier Script")
    var prom = new Promise((resolve, reject) => {
      //shell.cd(config.BINARIES_PATH)
      shell.exec(
        "./check_carrier.sh",
        { maxBuffer: 1024 * 500 * 500 },
  
        (err, stdout, stderr) => {
          if (err) {
            console.log("Failed CP", err);
            throw (err)
  
          } else {
            console.log("Success CP");
            resolve(stdout.trim())
          }
        }
      );
    });
    return prom;
}

// check carrier IP address every 4 hours
const init = () =>{ 
  runCarrier()
    setInterval(runCarrier, 1000 * 60 * 60 * 4)
}

module.exports = {
    init: init
}