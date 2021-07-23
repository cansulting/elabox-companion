const express = require("express")
const app = express()
// to allow cross-origin request
const cors = require("cors")
const bodyParser = require("body-parser")
const logger = require("morgan")
const fs = require("fs")
const config = require("./config")
const utils = require("./utilities")
var shell = require("shelljs")
var errorHandler = require("errorhandler")
//ota 
const path = require("path")
const fsExtra = require("fs-extra")
const StreamZip = require("node-stream-zip")
const { Storage } = require("@google-cloud/storage")
const storage = new Storage({ keyFilename: "./key.json" })
const bucketName = "elabox"
const cwd = path.join(__dirname, ".")
const storagePath = path.join(cwd, "/storage")
const packagePath=path.join(storagePath, "package")
const tempPath = path.join(storagePath, "tmp")
const elaSystemPath="/usr/ela/system/ela.system/"
const elaSystemInfoPath=path.join(elaSystemPath,"info.json")
const elaSystemInstallerPath=path.join(elaSystemPath,"main")
const elaTmpPath = "/tmp/ela"
const elaInstaller = path.join(elaTmpPath, "/main")
//end ota
// const NODE_URL = "localhost";
const NODE_URL = "192.168.18.71"

// define port number
const { exec, fork, spawn } = require("child_process")
const { execShell, checkProcessingRunning, killProcess } = require("./helper")
const isPortReachable = require("is-port-reachable")
const { json } = require("body-parser")
const delay = require("delay")
const { restart } = require("nodemon")

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
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SENDGRID_API);

let elaPath = config.ELA_DIR
let didPath = config.DID_DIR
let keyStorePath = config.KEYSTORE_PATH
router.get("/", (req, res) => {
  res.send("HELLO WORLD")
})

// initialize utility functions
utils()

router.get("/synced", (req, res) => {
  exec(
    "ls " + config.ELA_DIR + " | grep keystore.dat",
    { maxBuffer: 1024 * maxBufferSize },
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err)
      } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
      }
    }
  )
  res.json({ updated: true })
})

router.get("/ela", async (req, res) => {
  const isRunning = await checkProcessingRunning("ela")

  const servicesRunning = await isPortReachable(20336, { host: "localhost" })

  console.log("ela serviceRunning", servicesRunning)

  if (!isRunning || !servicesRunning) {
    return res.json({ isRunning, servicesRunning })
  }

  try {
    const blockCountResponse = await execShell(
      `curl -X POST http://User:Password@localhost:20336 -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' `,
      { maxBuffer: 1024 * maxBufferSize }
    )

    const blockCount = JSON.parse(blockCountResponse).result
    const latestBlock = await getBlockSize(blockCount - 1)
    const blockSizeList = []
    const nbOfTxList = []

    for (let i = 0; i < blockCount - 1 && i < 10; i++) {
      const blockSize = await getBlockSize(blockCount - 1 - i)
      blockSizeList.push(blockSize.size)
    }

    for (let i = 0; i < blockCount - 1 && i < 10; i++) {
      const nbOfTx = await getNbOfTx(blockCount - 1 - i)
      nbOfTxList.push(nbOfTx)
    }

    return res.json({
      blockCount: blockCount - 1,
      blockSizes: blockSizeList,
      nbOfTxs: nbOfTxList,
      isRunning: isRunning,
      servicesRunning,
      latestBlock: {
        blockTime: latestBlock.time,
        blockHash: latestBlock.hash,
        miner: latestBlock.minerinfo,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
})

router.get("/did", async (req, res) => {
  try {
    const isRunning = await checkProcessingRunning("did")

    const servicesRunning = await isPortReachable(20606, { host: "localhost" })

    console.log("serviceRunning", servicesRunning)

    if (!isRunning || !servicesRunning) {
      return res.json({ isRunning, servicesRunning })
    }

    const blockCountResponse = await execShell(
      'curl http://User:Password@localhost:20606 -H "Content-Type: application/json" -d \'{"method": "getcurrentheight"}\' ',
      { maxBuffer: 1024 * maxBufferSize }
    )
    const blockCount = JSON.parse(blockCountResponse).result

    const latestBlock = await getBlockSizeDid(blockCount)
    const blockSizeList = []
    const nbOfTxList = []

    for (let i = 0; i < blockCount && i < 10; i++) {
      const blockSize = await getBlockSizeDid(blockCount - i)
      blockSizeList.push(blockSize.size)
    }
    for (let i = 0; i < blockCount && i < 10; i++) {
      const nbOfTx = await getNbOfTxDid(blockCount - i)
      nbOfTxList.push(nbOfTx)
    }

    return res.status(200).json({
      blockCount: blockCount,
      blockSizes: blockSizeList,
      nbOfTxs: nbOfTxList,
      isRunning: isRunning,
      servicesRunning,
      latestBlock: {
        blockTime: latestBlock.time,
        blockHash: latestBlock.hash,
        miner: latestBlock.minerinfo,
      },
    })
  } catch (err) {
    res.status(500).send({ error: err })
  }
})

router.get("/carrier", async (req, res) => {
  try {
    const isRunning = await checkProcessingRunning("ela-bootstrapd")

    const carrierIP = await execShell("curl -s ipinfo.io/ip", {
      maxBuffer: 1024 * 500,
    })

    return res.status(200).json({ isRunning, carrierIP: carrierIP.trim() })
  } catch (err) {
    console.log(err)
    res.status(500).send({ error: err })
  }
})

function getBlockSize(height) {
  return new Promise(function (resolve, reject) {
    exec(
      "curl http://localhost:20334/api/v1/block/details/height/" + height + "",
      { maxBuffer: 1024 * maxBufferSize },
      (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          let details = JSON.parse(stdout)
          resolve(details.Result)
        }
      }
    )
  }).catch((error) => {
    console.log(error)
  })
}

function getBlockSizeDid(height) {
  return new Promise(function (resolve, reject) {
    exec(
      "curl http://localhost:20604/api/v1/block/details/height/" + height + "",
      { maxBuffer: 1024 * maxBufferSize },
      (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          let details = JSON.parse(stdout)
          resolve(details.Result)
        }
      }
    )
  }).catch((error) => {
    console.log(error)
  })
}

function getNbOfTx(height) {
  return new Promise(function (resolve, reject) {
    exec(
      "curl http://localhost:20334/api/v1/block/transactions/height/" +
        height +
        "",
      { maxBuffer: 1024 * maxBufferSize },
      (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          let details = JSON.parse(stdout)
          resolve(details.Result.Transactions.length)
        }
      }
    )
  }).catch((error) => {
    console.log(error)
  })
}

function getNbOfTxDid(height) {
  return new Promise(function (resolve, reject) {
    exec(
      "curl http://localhost:20604/api/v1/block/transactions/height/" +
        height +
        "",
      { maxBuffer: 1024 * maxBufferSize },
      (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          let details = JSON.parse(stdout)
          resolve(details.Result.Transactions.length)
        }
      }
    )
  }).catch((error) => {
    console.log(error)
  })
}

router.post("/sendTx", (req, res) => {
  let amount = req.body.amount
  let recipient = req.body.recipient
  let pwd = req.body.pwd
  console.log(amount, recipient, pwd)

  // 1 - buildtx
  exec(
    elaPath +
      "/ela-cli wallet buildtx -w " +
      elaPath +
      "/keystore.dat --to " +
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
            elaPath +
            "/keystore.dat -f to_be_signed.txn -p " +
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

router.post("/login", (req, res) => {
  let pwd = req.body.pwd
  console.log("PASSWORD RECEIVED", pwd, req.body)
  exec(
    elaPath +
      "/ela-cli wallet a -w " +
      elaPath +
      "/keystore.dat -p " +
      pwd +
      "",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      console.log("err", err)
      console.log("stdout", stdout)
      // console.log(stdout.split('\n')[2].split(' ')[0])
      if (err) {
        res.json({ ok: false })
      } else {
        res.json({ ok: true, address: stdout.split("\n")[2].split(" ")[0] })
      }
    }
  )
})

router.post("/createWallet", (req, res) => {
  let pwd = req.body.pwd
  console.log("PASSWORD RECEIVED", pwd, req.body)

  exec(
    "cd " + elaPath + "; ./ela-cli wallet create -p " + pwd + "",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      console.log(stdout)
      // res.json({balance})
      res.json({ ok: "ok" })
    }
  )

  // console.log(pwd)
})

// let users download the wallet file
router.get("/downloadWallet", function (req, res) {
  const file = `${elaPath}/keystore.dat`
  res.download(file)
})

router.post("/getBalance", (req, res) => {
  let address = req.body.address
  exec(
    "curl http://localhost:20334/api/v1/asset/balances/" + address,
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      console.log("getBalance", stdout)
      let balanceInfo = JSON.parse(stdout)
      let balance = balanceInfo.Result
      res.json({ balance })
    }
  )
})

router.get("/checkInstallation", async (req, res) => {
  // exec('test -e run-fan.pdd && echo false || echo true',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
  //   let configed = stdout
  //   exec('test -e /home/ubuntu/elabox/companion/maintenance.txt && echo true || echo false',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
  //     let maintenance = stdout
  //     res.json({configed, maintenance})
  //   });
  // });

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
  const file = `${elaPath}/keystore.dat`
  res.download(file)
})

const restartMainchain = async (callback) => {
    console.log("Restarting mainchain")
    await killProcess("ela")
    await requestSpawn(`nohup ./ela > /dev/null 2>output &`, 
      callback,
    {
      maxBuffer: 1024 * maxBufferSize,
      detached: true,
      shell: true,
      cwd: elaPath,
    })
}

const restartDid = async (callback) => {
    console.log("Restarting DID")
    await killProcess("did")
    await requestSpawn(`nohup ./did > /dev/null 2>output &`, 
      callback,
    {
      maxBuffer: 1024 * maxBufferSize,
      detached: true,
      shell: true,
      cwd: didPath,
    })
}

const restartCarrier = async (callback) => {
  console.log("Restarting Carrier")
  await killProcess("ela-bootstrapd")
  await requestSpawn( 
    "./ela-bootstrapd --config=bootstrapd.conf --foreground",
    callback,
    {
      maxBuffer: 1024 * 500 * 10000,
      detached: true,
      shell: true,
      cwd: config.CARRIER_DIR + "/",
    }
  )
}

const requestSpawn = async (command, callback, options) => {
  try {
    await delay(1000)

    const carrierSpawn = spawn(command, options)
    carrierSpawn.unref()

    carrierSpawn.stdout.on("data", (data) => {
      console.log(`${data}`)
    })
    carrierSpawn.stderr.on("data", (data) => {
      console.log(`ERROR ${data}`)
    })
    carrierSpawn.on("exit", (code, signal) => {
      if (!code) callback({ sucess: true })
      else callback({ success: false, error: signal })
    })
  } catch (err) {
    console.log(err)
    callback({ success: false, error: err })
  }
}

router.post("/restartMainchain", async (req, res) => {
  await restartMainchain((resp) => res.json(resp))
})

router.post("/restartDid", async (req, res) => {
  await restartDid((resp) => res.json(resp))
})

router.post("/restartCarrier", async (req, res) => {
  await restartCarrier((resp) => res.json(resp))
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
  const msg = {
    to: config.SUPPORT_EMAIL,
    from: req.body.email.trim(),
    subject: 'Elabox Support Needed ' + req.body.name,
    text: 'Elabox Support is needed to\n Name: ' + req.body.name + "\nEmail: " + req.body.email + "\nProblem: " + req.body.problem,
  };
  sgMail.send(msg, (err, result) => {
    if (err) {
      res.status(500)
    }
    else {
      res.send({ ok: true })
    }

  });
})
//ota routes
router.get("/update_version", processUpdateVersion)
router.post("/version_info", processVersionCheck)
router.get("/check_new_updates", processCheckNewUpdates)
router.get("/download_package",processDownloadPackage)
//end ota routes

const checkFile = (file) => {
  var prom = new Promise((resolve, reject) => {
    try {
      fs.access(file, fs.constants.R_OK, (err) => {
        console.log(`${file} ${err ? "is not readable" : "is readable"}`)
        return err ? resolve(false) : resolve(true)
      })
    } catch (err) {
      if (err) {
        resolve(false)
      }
    }
  }).catch((error) => {
    console.log(error)
  })

  return prom
}

const getOnionAddress = () => {
  return new Promise((resolve, reject) => {
    exec(
      "echo elabox | sudo -S cat /var/lib/tor/elabox/hostname",
      { maxBuffer: 1024 * maxBufferSize },
      async (err, stdout, stderr) => {
        resolve(stdout.trim())
      }
    )
  }).catch((error) => {
    console.log(error)
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
            resolve()
          }
        )
      }
    )
  }).catch((error) => {
    console.log(error)
  })
}
///ota functions
async function getCurrentVersion() {
  // const {build}= await fsExtra.readJSON(elaSystemInfoPath)
  // return build
  return new Promise((resolve, reject) => {
    fs.readdir(packagePath, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve(files[0].replace(".box", ""))
    })
  })  
}
async function getVersionInfo(version, path) {
  const elaJsonFile = `${path}/${version}.json`
  const info=await fsExtra.readJson(elaJsonFile)    
  return info 
}
async function getLatestVersion() {
  const [files] = await storage.bucket(bucketName).getFiles()
  const latestVersionFileName = files[files.length - 1].name
  return latestVersionFileName.replace("packages/", "").replace(".box", "").replace(".json", "")
}
async function runInstaller(socketId, version) {
  return new Promise(async (resolve, reject) => {
    try {
      await fsExtra.copy(elaSystemInstallerPath, elaInstaller)
      spawn("chmod", ["+x", elaInstaller])
      //for testing
      const installerLogs = spawn(`/var/tmp/packageinstaller`, [
        `${tempPath}/${version}.box`,
      ])      
      // const installerLogs = spawn(`${elaInstaller}`, [
      //   `${tempPath}/${version}.ela`,
      // ])
      installerLogs.stderr.setEncoding("utf8")
      installerLogs.stderr.on("data", (chunk) => {
        // data from standard output is here as buffers
        io.to(socketId).emit("installer_logs", chunk)
      })
      installerLogs.on("close", () => {
        resolve("done")
      })
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
    }
  }
  return {
    ...response,
    new_update: true,
  }
}
async function downloadElaFile(destinationPath, version,extension="box") {
  const destinationFileName = path.join(destinationPath, `/${version}.${extension}`)
  const options = {
    destination: destinationFileName,
  }
  await storage
    .bucket(bucketName)
    .file(`packages/${version}.${extension}`)
    .download(options)
}
async function processUpdateVersion(req, res) {
  try {
    const checkVersionResponse = await checkVersion()
    const socketId = req.get("socketId")
    if (checkVersionResponse.new_update) {
      io.to(socketId).emit("process_percent", {
        status: "running installer",
        percent: 20,
      })
      await runInstaller(socketId, checkVersionResponse.latest)
      io.to(socketId).emit("process_percent", {
        status: "cleaning files",
        percent: 40,
      })
      await fsExtra.emptyDir(elaTmpPath)
      io.to(socketId).emit("process_percent", {
        status: "cleaning files",
        percent: 70,
      })
      delay(1000)
      await fsExtra.emptyDir(packagePath)
      io.to(socketId).emit("process_percent", {
        status: "cleaning files",
        percent: 80,
      })
      delay(1000)      
      await downloadElaFile(packagePath, checkVersionResponse.latest)
      io.to(socketId).emit("process_percent", {
        status: "update installed",
        percent: 100,
      })
      res.send(true)
      return
    }
    res.send(false)
  } catch (error) {
    res.status(500).send("Update error.")
  }
}
async function processVersionCheck(req, res) {
  try {
    const { versionType } = req.body
    let path = elaSystemPath
    let version = await getCurrentVersion()
    if (versionType === "latest") {
      path = tempPath
      await fsExtra.emptyDir(path)
      version = await getLatestVersion()
      await downloadElaFile(path, version,"json")
      res.send(JSON.stringify(await getVersionInfo(version, path)))    
      return;  
    }
    res.send(await getVersionInfo("info", path))
  } catch (error) {
    res.status(500).send("Cannot get version info.")
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
async function processDownloadPackage(req,res){
  try {
    const socketId = req.get("socketId")    
    const path=tempPath
    const version = await getLatestVersion()
    io.to(socketId).emit("process_percent", {
      status: "downloading file",
      percent: 20,
    })    
    delay(1000)
    io.to(socketId).emit("process_percent", {
      status: "downloading file",
      percent: 40,
    })            
    delay(1000)
    io.to(socketId).emit("process_percent", {
      status: "downloading file",
      percent: 60,
    })                
    delay(1000)
    io.to(socketId).emit("process_percent", {
      status: "downloading file",
      percent: 80,
    })                    
    await downloadElaFile(path, version,"box")
    delay(1000)
    io.to(socketId).emit("process_percent", {
      status: "download complete",
      percent: 100,
    })           
    delay(1000)  
    //revert back
    io.to(socketId).emit("process_percent", {
      status: "download complete",
      percent: 0,
    })                  
    res.send(true)
  } catch (error) {
    res.status(500).send("Download error.")    
  }

}
//ota functions end
// define the router to use
app.use("/", router)

const server=app.listen(config.PORT, function () {
  console.log("Runnning on " + config.PORT)

  checkProcessingRunning("ela").then((running) => {
    if (!running) restartMainchain((response) => console.log(response))
  })

  checkProcessingRunning("did").then((running) => {
    if (!running) restartDid((response) => console.log(response))
  })

  checkProcessingRunning("ela-bootstrapd").then((running) => {
    if (!running) restartCarrier((response) => console.log( response))
  })
})

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET","POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
})


module.exports = app
