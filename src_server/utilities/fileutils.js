
const fs = require("fs");

function checkFile(file = "") {
    var prom = new Promise((resolve, reject) => {
        try {
          fs.access(file, fs.constants.R_OK, (err) => {
            return err ? resolve(false) : resolve(true);
          });
        } catch (err) {
            resolve(false);
        }
      })
    return prom
}

module.exports = {
    checkFile: checkFile
}