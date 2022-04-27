const { isPortTaken } = require("./utilities/isPortTaken")

function isRunning() {
  return isPortTaken(10018)
}

module.exports = {
  isRunning: isRunning
};