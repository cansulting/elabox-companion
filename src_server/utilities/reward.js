
const https = require("https");
const axiosP = require("axios");
const config = require("../config")

const axios = axiosP.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// define port number
const { exec } = require("child_process");
const fs = require("fs");

// check if file is readable or not
const checkFile = (file) => {
  var prom = new Promise((resolve, reject) => {
    try {
      fs.access(file, fs.constants.R_OK, (err) => {
        console.log(`${file} ${err ? "is not readable" : "is readable"}`);
        return err ? resolve(false) : resolve(true);
      });
    } catch (err) {
      if (err) {
        resolve(false);
      }
    }
  });
  return prom;
};

// ran every 10 minutes
async function checkRewards() {
  console.log("Checking rewards...")
  // check if wallet exist
  const keyExists = await checkFile(config.KEYSTORE_PATH)
  console.log(keyExists ? "Yes" : "No")
  // check if all services are running
  const allServices = await Promise.all([checkElaRunning(), checkCarrierRunning(), checkDidRunning()])
  const running = allServices.every( (v) =>  v === true )

  console.log("All Running", running)
  if (keyExists && running) {
    const keyStoreObj = JSON.parse(fs.readFileSync(config.KEYSTORE_PATH))
    const wallet = keyStoreObj.Account[0].Address
    const serial = await getSerialKey()
    const payload = { serial, wallet }
    // update elabox database for rewards
    var resp = await axios.post(
      "https://159.100.248.209:8080/",
      payload

    );
    console.log("Response", resp.data);
  }
}


// get RPi serial key
const getSerialKey = () => {
  console.log("FUN getSerialKey")
  var prom = new Promise((resolve, reject) => {
    exec(
      "cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2",
      { maxBuffer: 1024 * 500 },

      (err, stdout, stderr) => {
        if (err) {
          console.log("Failed CP");
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


const checkElaRunning = () => {
  console.log("FUN checkElaRunning")
  return new Promise((resolve, reject) => {
    exec('pidof -zx ela', { maxBuffer: 1024 * 500 }, async (err, stdout, stderr) => {
      { stdout == "" ? elaRunning = false : elaRunning = true }
      console.log("ela is running: ", elaRunning)
      resolve(elaRunning)
    })
  })
}

const checkDidRunning = () => {
  console.log("FUN checkDidRunning")
  return new Promise((resolve, reject) => {
    exec('pidof -zx did', { maxBuffer: 1024 * 500 }, async (err, stdout, stderr) => {
      { stdout == "" ? didRunning = false : didRunning = true }
      console.log("did is running: ", didRunning)
      resolve(didRunning)
    })
  })
}

const checkCarrierRunning = () => {
  console.log("FUN checkCarrierRunning")
  return new Promise((resolve, reject) => {
    exec('pidof -zx ela-bootstrapd', { maxBuffer: 1024 * 500 }, async (err, stdout, stderr) => {
      { stdout == "" ? carrierRunning = false : carrierRunning = true }
      console.log("carrier is running: ", carrierRunning)
      resolve(carrierRunning)
    });
  })
}

module.exports = checkRewards


