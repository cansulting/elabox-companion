const fan = require("./control_fan")
const reward = require("./reward")
const carrier = require("./carrier")

function init() {
  console.log("Initializing carrier, rewards and fan.")
  carrier.init()
  fan(1)

  // ran every 10 minutes
  setInterval(async () => {
    console.log("~~Start check~~")
    console.log(new Date(Date.now()))
    // run check_fan 
    try {
      await reward()
      await fan() 
    }
    catch (err) {
      console.log("ERROR while checking ", err)
    }
  }, 1000 * 60 * 10)

}

module.exports = init