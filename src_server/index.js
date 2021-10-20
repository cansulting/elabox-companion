const express = require("express")
const eventhandler = require("./helper/eventHandler")
const Downloader = require("nodejs-file-downloader")
const urlExist = require("url-exist")
// to allow cross-origin request
const cors = require("cors")
const bodyParser = require("body-parser")
const logger = require("morgan")
const fs = require("fs")
const config = require("./config")
const utils = require("./utilities")
const syslog = require("./logger")
var errorHandler = require("errorhandler")
//ota
const path = require("path")
const fsExtra = require("fs-extra")
const app = express()

// nodes
const NodeHandler = require("./nodeHandler")
const MainchainHandler = require("./mainchainHandler")
const feedsHandler = require("./feeds")
const mainchain = new MainchainHandler()
const eid = new NodeHandler({
  binaryName: "geth",
  cwd: config.EID_DIR,
  dataPath: config.EIDDATA_DIR + "/blocks",
  wsport: config.EID_PORT,
})
const esc = new NodeHandler({
  binaryName: "esc",
  cwd: config.ESC_DIR,
  dataPath: config.ESCDATA_DIR + "/blocks",
  wsport: config.ESC_PORT,
})

// define port number
const { exec, spawn } = require("child_process")
const {
  execShell,
  checkProcessingRunning,
  killProcess,
  requestSpawn,
} = require("./helper")
const delay = require("delay")

// initializes log watchers
require("./watchers")

app.use(logger("dev"))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(errorHandler({ dumpExceptions: true, showStack: true }))
const maxBufferSize = 10000

// create a routes folder and add routes there
const router = express.Router()

// for mailing
const postmark = require("postmark")
const postMarkMail = new postmark.ServerClient(config.POSTMARK_SERVER_TOKEN)
var feedsNodestatus = ""
var carrierNodestatus = ""

let elaPath = config.ELA_DIR
let keyStorePath = config.KEYSTORE_PATH
router.get("/", (req, res) => {
  res.send("HELLO WORLD")
})

// initialize utility functions
utils()

router.get("/synced", (req, res) => {
  exec(
    "ls " + config.ELADATA_DIR + " | grep keystore.dat",
    { maxBuffer: 1024 * maxBufferSize },
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        syslog.write(syslog.create().error("Error on /synced request", err).addStack())
      } else {
        // the *entire* stdout and stderr (buffered)
        syslog.write(syslog.create().debug("Route /synced result " + stdout))
        if (stderr)
          syslog.write(syslog.create().error("Error on /synced request", stderr).addCaller())
      }
    }
  )
  res.json({ updated: true })
})

router.get("/ela", async (req, res) => {
  try {
    statusMain =  res.json(await mainchain.getStatus())
    console.log(statusMain)
    return res.json(await mainchain.getStatus())
  } catch (err) {
    // return res.json(await mainchain.getStatus())
    return res.status(500).send({ error: err })
  }
})

router.get("/eid", async (req, res) => {
  try {
    eid.getStatus().then((data) => res.status(200).json(data))
  } catch (err) {
    res.status(500).send({ error: err })

  }
})

router.get("/esc", async (req, res) => {
  try {
    esc.getStatus().then((data) => res.status(200).json(data))
  } catch (err) {
    res.status(500).send({ error: err })
  }
})

router.get("/carrier", async (req, res) => {
  try {
    const isRunning = await checkProcessingRunning("ela-bootstrapd")

    const carrierIP = await execShell("curl -s ifconfig.me", {
      maxBuffer: 1024 * 500,
    })

    var nodestatus = ""

    if (!isRunning && carrierIP == null) {
      nodestatus = "Connection refused to Carrier IP and ela-bootstrapped not found"
    }else if (carrierIP==null) {
      nodestatus = "Connection refused to Carrier IP"
    }else if (!isRunning) {
      nodestatus = "ela-bootstrapped not found"
    }else{
      nodestatus = ""
    }

    // If corruption failure occurs, it gets corrupted response from feeds
    if (carrierNodestatus != ""){
      nodestatus = carrierNodestatus
    }
  

    return res.status(200).json({ isRunning, carrierIP: carrierIP.trim(), nodestatus })
  } catch (err) {
    syslog.write(syslog.create().error("Error on /carrier request ", err).addStack())
    res.status(500).send({ error: err })
  }
})
router.get("/feeds", async (req, res) => {
  try {
    const isRunning = await urlExist(config.FEEDS_URL)
    if (!isRunning) {
      nodestatus = "Feeds binary file not found"
    }else{
      nodestatus = ""
    }

    // If corruption failure occurs, it gets corrupted response from feeds
    if (feedsNodestatus != ""){
      nodestatus = feedsNodestatus
    }

    return res.status(200).json({ isRunning: isRunning, nodestatus:nodestatus })
  } catch (err) {
    syslog.write(syslog.create().error("Error on /feeds request ", err).addStack())
    res.status(500).send({ error: err })
  }
})


router.post("/sendElaPassswordVerification", (req, res) => {
  let pwd = req.body.pwd
  exec(
    elaPath +
      "/ela-cli wallet a -w " +
      config.KEYSTORE_PATH +
      " -p " +
      pwd +
      "",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      console.log("err", err)
      console.log("stdout", stdout)
      if (err) {
        res.json({ ok: false })
      } else {
        res.json({ ok: true, address: stdout.split("\n")[2].split(" ")[0] })
      }
    }
  )

})


router.post("/sendTx", (req, res) => {
  let amount = req.body.amount
  let recipient = req.body.recipient
  let pwd = req.body.pwd
  syslog.write(syslog.create().debug(`Sending coint ammount=${amount} recipient=${recipient}`))

  // 1 - buildtx
  exec(
    elaPath +
      "/ela-cli wallet buildtx -w " +
      config.KEYSTORE_PATH +
      " --to " +
      recipient +
      " --amount " +
      amount +
      " --fee 0.001 --rpcuser User --rpcpassword Password " +
      pwd,
    { maxBuffer: 1024 * 500 },
    async (err, stdout) => {
      if (!err) {
        // 2 - signtx
        exec(
          elaPath +
            "/ela-cli wallet signtx -w " +
            config.KEYSTORE_PATH +
            " -f to_be_signed.txn -p " +
            pwd,
          { maxBuffer: 1024 * maxBufferSize },
          async (err, stdout) => {
            if (!err) {
              // 3 - sendtx
              exec(
                elaPath +
                  "/ela-cli wallet sendtx -f ready_to_send.txn --rpcuser User --rpcpassword Password",
                { maxBuffer: 1024 * maxBufferSize },
                async (err, stdout) => {
                  if (!err) {
                    res.json({ ok: "ok" })
                  } else {
                    syslog.write(syslog.create().error(`Error while sending coin to ${recipient}`, err).addCaller())
                    res.json({ ok: "nope" })
                  }
                }
              )
            } else {
              res.json({ ok: "nope" })
            }
          }
        )
      } else {
        res.json({ ok: "nope" })
      }
    }
  )
})



router.post("/resyncNodeVerification", (req, res) => {
  let pwd = req.body.pwd
  console.log("PASSWORD RECEIVED", pwd, req.body)
  exec(
    elaPath +
      "/ela-cli wallet a -w " +
      config.KEYSTORE_PATH +
      " -p " +
      pwd +
      "",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      console.log("err", err)
      console.log("stdout", stdout)
      if (err) {
        res.json({ ok: false })
      } else {
        res.json({ ok: true, address: stdout.split("\n")[2].split(" ")[0] })
      }
    }
  )

})



router.post("/login", (req, res) => {
  let pwd = req.body.pwd
  exec(
    elaPath +
      "/ela-cli wallet a -w " +
      config.KEYSTORE_PATH +
      " -p " +
      pwd +
      "",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      if (stdout) 
        syslog.write(syslog.create().debug("/login request " + stdout))
      if (err) {
        syslog.write(syslog.create().error("Error on /login. Failed ela cli exec.", err).addCaller())
        res.json({ ok: false })
      } else {
        res.json({ ok: true, address: stdout.split("\n")[2].split(" ")[0] })
      }
    }
  )
})

router.post("/createWallet", (req, res) => {
  let pwd = req.body.pwd
  exec(
    "echo 'elabox:" + pwd + "' | sudo chpasswd",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      syslog.write(syslog.create().debug("Updating Raspberry PI password"))
      if (!stdout) {
        syslog.write(syslog.create().debug("Success updating RPI password " + stdout))
      }
      if (err) {
        syslog.write(syslog.create().error("Error while updating RPI password", err).addCaller())
      }
      if (stderr) {
        syslog.write(syslog.create().error("Error while updating RPI password.", stderr).addCaller())
      }
    }
  )

  exec(
    "cd " +
      config.ELADATA_DIR +
      "; " +
      config.ELA_DIR +
      "/ela-cli wallet create -p " +
      pwd +
      "",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      if (stderr) {
        syslog.write(syslog.create().error("Error while updating RPI password.", stderr).addCaller())
      }
      if (err) {
        syslog.write(syslog.create().error("Error while creating wallet", err).addCaller())
        res.json({ ok: "nope" })
      } else {
        syslog.write(syslog.create().debug("Success creating wallet " + stdout))
        res.json({ ok: "ok" })
      }
    }
  )
})

// let users download the wallet file
router.get("/downloadWallet", function (req, res) {
  res.download(config.KEYSTORE_PATH)
})

router.post("/getBalance", (req, res) => {
  let address = req.body.address
  exec(
    "curl http://localhost:20334/api/v1/asset/balances/" + address,
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      if (err) 
        syslog.write(syslog.create().error("Error retrieving wallet balance", err).addCaller())
      let balance = "..."
      if (stdout !== "") {
        let balanceInfo = JSON.parse(stdout)
        balance = balanceInfo.Result
      }
      res.json({ balance })
    }
  )
})

router.get("/checkInstallation", async (req, res) => {
  res.send({ configed: JSON.stringify(await checkFile(keyStorePath)) })
})

router.post("/update", (req, res) => {
  let version = req.body.version
  // create a tmp file to know that it's updating
  exec(
    "touch maintenance.txt",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      // download zip of the new version
      exec(
        "wget ...." + version,
        { maxBuffer: 1024 * maxBufferSize },
        async (err, stdout, stderr) => {}
      )
    }
  )
})

// let users download the wallet file
router.get("/downloadWallet", function (req, res) {
  res.download(config.KEYSTORE_PATH)
})

const restartCarrier = async (callback) => {
  syslog.write(syslog.create().info("Restarting carrier...").addCategory("carrier"))
  await killProcess("ela-bootstrapd")
  await requestSpawn(
    //"./ela-bootstrapd --config=bootstrapd.conf --foreground",
    "./ela-bootstrapd --config=bootstrapd.conf",
    callback,
    {
      maxBuffer: 1024 * 500 * 10000,
      detached: true,
      shell: true,
      cwd: config.CARRIER_DIR + "/",
    },
    (err, stdout, stderr) => {
      if (err) {
        console.log("Failed to start carrier", stdout);
        console.log("Stdout", stdout);
        carrierNodestatus = stderr
      } 
    }


  )
}

router.post("/restartMainchain", async (req, res) => {
  await mainchain.restart((resp) => 
  {
    console.log("RESPONSE ", res.json(resp).data)
    res.json(resp)
  }
  )
})

router.post("/resyncMainchain", async (req, res) => {
  await mainchain.resync((resp) => res.json(resp))
})

router.post("/restartEID", async (req, res) => {
  await eid.restart((resp) => res.json(resp))
})

router.post("/resyncEID", async (req, res) => {
  await eid.resync((resp) => res.json(resp))
})

router.post("/restartESC", async (req, res) => {
  await esc.restart((resp) => res.json(resp))
})

router.post("/resyncESC", async (req, res) => {
  await esc.resync((resp) => res.json(resp))
})

router.post("/restartCarrier", async (req, res) => {
  await restartCarrier((resp) => res.json(resp))
})
router.post("/restartFeeds", async (req, res) => {
  const isSucess = await feedsHandler.runFeeds()
  if (isSucess.success){
    res.status(200).json({ success: isSucess.success})
  }else{
    res.status(200).json({ success: isSucess.success})
  }
})
router.get("/getOnion", async (req, res) => {
  res.send({ onion: await getOnionAddress() })
})

router.get("/regenerateOnion", async (req, res) => {
  await regenerateTor()
  res.send({ onion: await getOnionAddress() })
})

// support mail
router.post("/sendSupportEmail", async (req, res) => {
  try {
    const msg = {
      to: config.SUPPORT_EMAIL,
      from: config.POSTMARK_FROM_EMAIL,
      subject: "Elabox Support Needed " + req.body.name,
      htmlBody:
        "Elabox Support is needed to\n Name: " +
        req.body.name +
        "\nEmail: " +
        req.body.email +
        "\nProblem: " +
        req.body.problem,
    }
    await postMarkMail.sendEmail(msg)
    res.send({ ok: true })
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})
//ota routes
router.get("/update_version", processUpdateVersion)
router.post("/version_info", (req, res) => {
  res.send({ version: config.ELABOX_VERSION, env: config.BUILD_MODE })
})
router.get("/check_new_updates", processCheckNewUpdates)
router.get("/download_package", processDownloadPackage)
router.get("/latest_eid", async (req, res) => {
  const block = await eid.getLatestBlock()
  res.json(block)
})
//end ota routes

const checkFile = (file) => {
  var prom = new Promise((resolve, reject) => {
    try {
      fs.access(file, fs.constants.R_OK, (err) => {
        if (err) 
          syslog.write(syslog.create().error(`File ${file} is not readable.`, err).addCaller())
        return err ? resolve(false) : resolve(true)
      })
    } catch (err) {
      if (err) {
        resolve(false)
      }
    }
  }).catch((error) => {
    syslog.write(syslog.create().error(`Error while checking file ${file}`, error).addCaller())
  })

  return prom
}

const getOnionAddress = () => {
  return new Promise((resolve, reject) => {
    exec(
      "echo elabox | sudo -S cat /var/lib/tor/elabox/hostname",
      { maxBuffer: 1024 * maxBufferSize },
      async (err, stdout, stderr) => {
        if (err) {
          syslog.write(syslog.create().error(`Error while getting onion address`, err).addCaller())
          reject(err)
          return
        }
        resolve(stdout.trim())
      }
    )
  })
}

const regenerateTor = () => {
  return new Promise((resolve, reject) => {
    exec(
      "echo elabox | sudo -S rm -rf /var/lib/tor/elabox",
      { maxBuffer: 1024 * maxBufferSize },
      async (err, stdout, stderr) => {
        exec(
          "echo elabox | sudo -S systemctl restart tor@default",
          { maxBuffer: 1024 * maxBufferSize },
          async (err, stdout, stderr) => {
            if (err) {
              syslog.write(syslog.create().error(`Error while generating Tor address`, err).addCaller())
              reject(err)
              return
            }
            resolve()
          }
        )
      }
    )
  })
}
///ota functions
async function getCurrentVersion() {
  const { build } = await fsExtra.readJSON(config.ELA_SYSTEM_INFO_PATH)
  return build
}
async function getVersionInfo(version, path) {
  const elaJsonFile = `${path}/${version}.json`
  const info = await fsExtra.readJson(elaJsonFile)
  return info
}
async function getLatestVersion() {
  let version = 1
  while (version) {
    version += 1
    const isExist = await urlExist(`${config.PACKAGES_URL}/${version}.json`)
    if (!isExist) {
      version -= 1
      break
    }
  }
  return version
}
async function runInstaller(version) {
  return new Promise(async (resolve, reject) => {
    try {
      await fsExtra.copy(
        config.ELA_SYSTEM_INSTALLER_PATH,
        config.ELA_SYSTEM_TMP_INSTALLER
      )
      spawn("chmod", ["+x", config.ELA_SYSTEM_TMP_INSTALLER])
      spawn("elasystem", ["terminate"])
      const installPackageProcess = spawn(
        `${config.ELA_SYSTEM_TMP_INSTALLER}`,
        [`${config.TMP_PATH}/${version}.box`, "-s", "-l"],
        { detached: true, stdio: "ignore" }
      )
      installPackageProcess.unref()
      resolve("completed")
    } catch (error) {
      reject("error")
    }
  })
}
async function checkVersion() {
  const currentVersion = await getCurrentVersion()
  const latestVersion = await getLatestVersion()
  const response = {
    current: currentVersion,
    latest: latestVersion,
  }
  if (currentVersion === latestVersion) {
    return {
      ...response,
      new_update: false,
      count: 0,
    }
  }
  return {
    ...response,
    new_update: true,
    count: 1,
  }
}
async function downloadElaFile(destinationPath, version, extension = "box") {
  const downloader = new Downloader({
    url: `${config.PACKAGES_URL}/${version}.${extension}`,
    directory: destinationPath,
  })
  await downloader.download()
}
async function processUpdateVersion(req, res) {
  try {
    const checkVersionResponse = await checkVersion()
    if (checkVersionResponse.new_update) {
      await runInstaller(checkVersionResponse.latest)
      // await fsExtra.emptyDir(config.ELA_SYSTEM_TMP_PATH)
      res.send(true)
      return
    }
    res.send(false)
  } catch (error) {
    res.status(500).send("Update error.")
  }
}
async function processCheckNewUpdates(req, res) {
  try {
    const checkVersionResponse = await checkVersion()
    res.send(JSON.stringify(checkVersionResponse))
  } catch (error) {
    res.status(500).send("Update error.")
  }
}

async function processDownloadPackage(req, res) {
  try {
    const path = config.TMP_PATH
    const version = await getLatestVersion()
    eventhandler.broadcast(
      config.INSTALLER_PK_ID,
      config.ELA_SYSTEM_BROADCAST_ID_INSTALLER,
      {
        status: "downloading file",
        percent: 20,
      }
    )
    await delay(1000)
    eventhandler.broadcast(
      config.INSTALLER_PK_ID,
      config.ELA_SYSTEM_BROADCAST_ID_INSTALLER,
      {
        status: "downloading file",
        percent: 40,
      }
    )
    await delay(1000)
    eventhandler.broadcast(
      config.INSTALLER_PK_ID,
      config.ELA_SYSTEM_BROADCAST_ID_INSTALLER,
      {
        status: "downloading file",
        percent: 60,
      }
    )
    await delay(1000)
    eventhandler.broadcast(
      config.INSTALLER_PK_ID,
      config.ELA_SYSTEM_BROADCAST_ID_INSTALLER,
      {
        status: "downloading file",
        percent: 80,
      }
    )
    await downloadElaFile(path, version, "box")
    eventhandler.broadcast(
      config.INSTALLER_PK_ID,
      config.ELA_SYSTEM_BROADCAST_ID_INSTALLER,
      {
        status: "downloading file",
        percent: 100,
      }
    )
    await delay(1000)
    //revert back
    eventhandler.broadcast(
      config.INSTALLER_PK_ID,
      config.ELA_SYSTEM_BROADCAST_ID_INSTALLER,
      {
        status: "download complete",
        percent: 0,
      }
    )
    res.send(true)
  } catch (error) {
    res.status(500).send("Download error.")
  }
}

app.use("/", router)

app.listen(config.PORT, async function () {
  syslog.write(syslog.create().info("Companion start running on " + config.PORT))
  await feedsHandler.runFeeds()
  checkProcessingRunning("ela-bootstrapd").then((running) => {
    if (!running) restartCarrier((response) => {
      syslog.write(syslog.create().debug('Carrier restart response ' + response))
    })
  })


  await mainchain.init()
  mainchain.setOnComplete(async () => {
    await eid.init()
    await eid.setOnComplete(() => esc.init())
  })
})

module.exports = app
