const fan = require("./control_fan")
const carrier = require("./carrier")
const syslog = require("../logger")

function init() {
  syslog.write(syslog.create().info("Initializing carrier and fan..."))
  carrier.init()
  fan(1)

  // ran every 10 minutes
  setInterval(async () => {
    // run check_fan 
    try {
      await fan() 
    }
    catch (err) {
    }
  }, 1000 * 60 * 10)
}

module.exports = init