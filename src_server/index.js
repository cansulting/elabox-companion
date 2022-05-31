const express = require("express");
const eventhandler = require("./helper/eventHandler");
const urlExist = require("fix-esm").require("url-exist");
const quote = require('shell-quote').quote;
const { generateKeystore, changePassword, authenticatePassword, authLimiter , resetRateLimit } = require("./utilities/auth")
// to allow cross-origin request
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const fs = require("fs");
const config = require("./config");
const utils = require("./utilities");
const syslog = require("./logger");
const keystore = require("./utilities/keystore")
var errorHandler = require("errorhandler");
//ota
const path = require("path");
const fsExtra = require("fs-extra");
const axios = require("axios");
const app = express();

// nodes
const NodeHandler = require("./nodeHandler");
const MainchainHandler = require("./mainchainHandler");
const feedsHandler = require("./feeds");
const mainchain = MainchainHandler.instance;
const eid = new NodeHandler({
  binaryName: "ela.eid",
  cwd: config.EID_DIR,
  dataPath: config.EIDDATA_DIR + "/blocks",
  wsport: config.EID_PORT,
  rpcport: config.RPC_PORT_EID,
});
const esc = new NodeHandler({
  binaryName: "ela.esc",
  cwd: config.ESC_DIR,
  dataPath: config.ESCDATA_DIR + "/blocks",
  wsport: config.ESC_PORT,
  rpcport: config.RPC_PORT_ESC,
});

// define port number
const { exec, spawn } = require("child_process");
const {
  execShell,
  checkProcessingRunning,
  killProcess,
  requestSpawn,
} = require("./helper");
const delay = require("delay");

// initializes log watchers
require("./watchers");

app.use(logger("dev"));
app.use(cors({
  exposedHeaders:['RateLimit-Limit','RateLimit-Remaining','Retry-After','RateLimit-Reset']
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));
const maxBufferSize = 10000;

// create a routes folder and add routes there
const router = express.Router();

// for mailing
const postmark = require("postmark");
const filedownload = require("./helper/filedownload");
const { readWalletAddress } = require("./utilities/keystore");
const postMarkMail = new postmark.ServerClient(config.POSTMARK_SERVER_TOKEN);

const licenseChecker = require("./utilities/license")
const transactions = require("./helper/transactions")

let elaPath = config.ELA_DIR;
router.get("/", (req, res) => {
  res.send("HELLO WORLD");
});

// initialize utility functions
utils();

router.get("/synced", (req, res) => {
  exec(
    "ls " + config.ELADATA_DIR + " | grep keystore.dat",
    { maxBuffer: 1024 * maxBufferSize },
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        syslog.write(
          syslog.create().error("Error on /synced request", err).addStack()
        );
      } else {
        // the *entire* stdout and stderr (buffered)
        syslog.write(syslog.create().debug("Route /synced result " + stdout));
        if (stderr)
          syslog.write(
            syslog
              .create()
              .error("Error on /synced request", stderr)
              .addCaller()
          );
      }
    }
  );
  res.json({ updated: true });
});

router.get("/ela", async (req, res) => {
  try {
    return res.json(await mainchain.getStatus());
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.get("/eid", async (req, res) => {
  try {
    eid.getStatus().then((data) => res.status(200).json({...data}));
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.get("/esc", async (req, res) => {
  try {
    esc.getStatus().then((data) => res.status(200).json({...data, port: config.RPC_PORT_ESC,chainId:config.ESC_CHAIN_ID}));
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.get("/carrier", async (req, res) => {
  try {
    const isRunning = await checkProcessingRunning("ela-bootstrapd");

    const carrierIP = await execShell("curl -s ifconfig.me", {
      maxBuffer: 1024 * 500,
    });

    return res.status(200).json({ isRunning, carrierIP: carrierIP.trim() });
  } catch (err) {
    syslog.write(
      syslog.create().error("Error on /carrier request ", err).addStack()
    );
    res.status(500).send({ error: err });
  }
});
router.get("/feeds", async (req, res) => {
  try {
    const isRunning = await feedsHandler.isRunning()
    return res.status(200).json({ isRunning: isRunning });
  } catch (err) {
    syslog.write(
      syslog.create().error("Error on /feeds request ", err).addStack()
    );
    res.status(500).send({ error: err });
  }
});


router.post("/sendElaPassswordVerification", (req, res) => {
  let pwd = req.body.pwd;
  exec(
    elaPath +
      "/ela-cli wallet a -w " +
      config.KEYSTORE_PATH +
      " -p " +
      pwd +
      "",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      console.log("err", err);
      console.log("stdout", stdout);
      if (err) {
        res.json({ ok: false });
      } else {
        res.json({ ok: true, address: stdout.split("\n")[2].split(" ")[0] });
      }
    }
  );
});

router.post("/sendTx", (req, res) => {
  let amount = req.body.amount;
  let recipient = req.body.recipient;
  let pwd = req.body.pwd;
  syslog.write(
    syslog
      .create()
      .debug(`Sending coins ammounting=${amount} recipient=${recipient}`)
  );
  try {
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
                      res.json({ ok: "ok" });
                    } else {
                      syslog.write(
                        syslog
                          .create()
                          .error(
                            `Error while sending coin to ${recipient}`,
                            err
                          )
                          .addCaller()
                      );
                      res.json({ ok: "nope", reason: stdout });
                    }
                  }
                );
              } else {
                res.json({ ok: "nope", reason: stdout });
              }
            }
          );
        } else {
          res.json({ ok: "nope", reason: stdout });
        }
      }
    );
  } catch (e) {
    syslog.write(syslog.create().error("Failed sendTx", e));
    res.json({ ok: "nope" });
  }
});

router.post("/authentication", (req, res) => {
  let pwd = req.body.pwd;
  //console.log("PASSWORD RECEIVED", pwd, req.body);
  authenticatePassword(pwd)
    .then( _ => {
      res.json({ ok: true });
    }
  ).catch(err => {
    res.json({ ok: false });
  });
});
router.get("/rateLimitWaitTime",(req,res)=>{
  res.json({rateLimitRemaining: global.rateLimitRemaining})
})
router.post("/login",(req, res) => {
  let pwd = req.body.pwd;
  // is still waiting to finish the security lock
  if (global.rateLimitRemaining > 0) {
    res.json({ ok: false, err: global.rateLimitRemaining + " seconds remaining" })
    return 
  }
  authenticatePassword(pwd)
    .then( _ => {
      resetRateLimit()  
      readWalletAddress().then(address => {
        res.json({ ok: true, address: address })
      }).catch(e => {
        res.json({ ok: false, err: e.message })
      })   
    })
    .catch( err => {
      global.currentRateLimit -=1;
      authLimiter(res)
      res.json({ ok: false, err: err.message })
    })
});

router.post("/createWallet", (req, res) => {
  let pwd = req.body.pwd;
  generateKeystore(pwd)
    .then( (_) => {
        changePassword(pwd)
        .then( (_) => {
          res.json({ ok: "ok" });
        }).catch(err => {
          res.json({ ok: "nope", err: err.message });
        })
    }).catch(err => {
      res.json({ ok: "nope", err: err.message });
    })
});

// let users download the wallet file
router.get("/downloadWallet", function (req, res) {
  const { pass} = req.query;
  authenticatePassword(pass).then( _ => {
    res.download(config.KEYSTORE_PATH);
  }).catch(e => {
    res.sendStatus(403);
  })
  
});

router.post("/uploadWallet", function (req, res) {
  const { wallet, oldpass, newpass} = req.body
  keystore.uploadFromHex(wallet, oldpass, newpass)
    .then( _ => res.json({ ok: 'ok'}))
    .catch( err => res.json({ ok: 'nope', err: err.message}))
})

router.post("/getBalance", (req, res) => {
  let address = req.body.address;
  const command = quote(["curl",`http://localhost:20334/api/v1/asset/balances/${address}`]);
  exec(
    command,
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      let balance = "...";                    
      if (err)
      {
        const data={
          "method":"getreceivedbyaddress",
          "params":{"address": address  }
        }
        const headers={
          "Content-Type":"application/json"
        }
         await axios.post(config.ELA_RPC_URL,data,{headers}).then(response=>{
          const { data } = response
          balance=parseFloat(data.result)
          res.json({balance})
        }).catch(err=>{
          syslog.write(
            syslog
              .create()
              .error("Error retrieving wallet balance", err)
              .addCaller()
          );
        })
      }
      else{
        if (stdout !== "") {
          let balanceInfo = JSON.parse(stdout);
          balance = balanceInfo.Result;
        }        
      }
      res.json({ balance });
    }
  );
});

router.get("/checkInstallation", async (req, res) => {
  let isExist = await checkFile(config.KEYSTORE_PATH)
  if (!isExist) {
    isExist = await checkFile(config.OLD_KEYSTORE_PATH)
  }
  res.send({ configed: isExist });
});

router.post("/update", (req, res) => {
  let version = req.body.version;
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
      );
    }
  );
});

const restartCarrier = async (callback) => {
  syslog.write(
    syslog.create().info("Restarting carrier...").addCategory("carrier")
  );
  await killProcess("ela-bootstrapd");
  await requestSpawn(
    //"./ela-bootstrapd --config=bootstrapd.conf --foreground",
    "./ela-bootstrapd --config=bootstrapd.conf",
    callback,
    {
      maxBuffer: 1024 * 500 * 10000,
      detached: true,
      shell: true,
      cwd: config.CARRIER_DIR + "/",
    }
  );
};

router.post("/restartMainchain", (req, res) => {
  const { pwd } = req.body;  
  authenticatePassword(pwd).then( async () => {
    await mainchain.restart((resp) => res.json(resp));
  }).catch(_=>{
    res.sendStatus(401)
  });
});

router.post("/resyncMainchain", (req, res) => { 
  const {pwd} = req.body;
  authenticatePassword(pwd).then( async () => {
    await mainchain.resync((resp) => res.json(resp));    
  }).catch(_=>{
    res.sendStatus(401)    
  });
});

router.post("/restartEID", (req, res) => {
  const {pwd} = req.body;
  authenticatePassword(pwd).then( async () => {
    await eid.restart((resp) => res.json(resp));
  }).catch(_=>{
    res.sendStatus(401)    
  });
});

router.post("/resyncEID", (req, res) => {
  const {pwd} = req.body;
  authenticatePassword(pwd).then( async () => {
    await eid.resync((resp) => res.json(resp));
  }).catch(_=>{
    res.sendStatus(401)
  });  
});

router.post("/restartESC", (req, res) => {
  const {pwd} = req.body;
  authenticatePassword(pwd).then( async () => {
    await esc.restart((resp) => res.json(resp));
  }).catch(_=>{
    res.sendStatus(401)
  });
});

router.post("/resyncESC", (req, res) => {
  const {pwd} = req.body;
  authenticatePassword(pwd).then( async () => {
    await esc.resync((resp) => res.json(resp));
  }).catch(_=>{
    res.sendStatus(401)
  });  

});

router.post("/restartCarrier", (req, res) => {
  const {pwd} = req.body;
  authenticatePassword(pwd).then( async () => {
    await restartCarrier((resp) => res.json(resp));
  }).catch(_=>{
    res.sendStatus(401)
  });  
});

// get wallet transactions
router.post("/utxo", (req, res) => {
  const {wallet} = req.body
  transactions.retrieveUTX(wallet)
    .then( _res => {
      if(_res.hasOwnProperty("result")){
        return res.json(_res.result.History)
      }
      return res.json(_res)
    })
    .catch( err => {
      console.log(err)
      res.sendStatus(500)
    })
})

router.get("/getOnion", async (req, res) => {
  res.send({ onion: await getOnionAddress() });
});

router.get("/regenerateOnion", async (req, res) => {
  await regenerateTor();
  res.send({ onion: await getOnionAddress() });
});

// use to check if elabox was already activated
router.get("/elabox_activated", async (req, res) => {
  try {
    const activated = await licenseChecker.isElaboxActivated()
    res.send({ activated: activated});
  } catch(err) {
    syslog.write(syslog.create().error("/elabox_activated request failed", err))
    res.send({ activated: false, error: err.message})
  }
});

router.post("/activate_elabox", async (req, res) => {
  const { did } = req.body;
  try {
    const isActivated = await licenseChecker.activateElabox(did);
    res.send({ activated: isActivated });
  }catch(err) {
    syslog.write(syslog.create().error("/activate_elabox request failed", err))
    res.send({ activated: false, error: err.message})
  }
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
    };
    await postMarkMail.sendEmail(msg);
    res.send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
//ota routes
router.get("/update_version", processUpdateVersion);
router.post("/version_info", async (req, res) => {
  const { version_type } = req.body;
  if (version_type === "current") {
    res.send({
      version: config.ELABOX_VERSION,
      env: config.BUILD_MODE,
    });
  } else {
    let currentVersion;
    try {
      currentVersion = await getCurrentBuild();
      const latestVersion = await checkLatestBuild(currentVersion);
      const info = await getVersionInfo(latestVersion);
      res.send({
        version: info.version,
        description:info.description,
        env: config.BUILD_MODE,
        name: info.name,
      });
    } catch (e) {
      res.send({
        version: currentVersion,
        description:"",
        env: config.BUILD_MODE,
        name: "",
      });
      syslog.write(syslog.create().error(e.message, e));
    }
  }
});
router.get("/check_new_updates", processCheckNewUpdates);
router.get("/download_package", processDownloadPackage);

//end ota routes

const checkFile = (file) => {
  var prom = new Promise((resolve, reject) => {
    try {
      fs.access(file, fs.constants.R_OK, (err) => {
        if (err)
          syslog.write(
            syslog
              .create()
              .error(`File ${file} is not readable.`, err)
              .addCaller()
          );
        return err ? resolve(false) : resolve(true);
      });
    } catch (err) {
      if (err) {
        resolve(false);
      }
    }
  }).catch((error) => {
    syslog.write(
      syslog
        .create()
        .error(`Error while checking file ${file}`, error)
        .addCaller()
    );
  });

  return prom;
};

const getOnionAddress = () => {
  return new Promise((resolve, reject) => {
    exec(
      "echo elabox | sudo -S cat /var/lib/tor/elabox/hostname",
      { maxBuffer: 1024 * maxBufferSize },
      async (err, stdout, stderr) => {
        if (err) {
          syslog.write(
            syslog
              .create()
              .error(`Error while getting onion address`, err)
              .addCaller()
          );
          reject(err);
          return;
        }
        resolve(stdout.trim());
      }
    );
  });
};

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
              syslog.write(
                syslog
                  .create()
                  .error(`Error while generating Tor address`, err)
                  .addCaller()
              );
              reject(err);
              return;
            }
            resolve();
          }
        );
      }
    );
  });
};
///ota functions
async function getCurrentBuild() {
  const { build } = await fsExtra.readJSON(config.ELA_SYSTEM_INFO_PATH);
  return build;
}
async function getVersionInfo(version) {
  const { data } = await axios.get(`${config.PACKAGES_URL}/${version}.json`);
  return data;
}
//node version
// use to check the latest build
// @build. the starting point of build to check
async function checkLatestBuild(build = 1) {
  let running = build;
  while (true) {
    running++;
    const isExist = await urlExist(`${config.PACKAGES_URL}/${running}.json`);
    if (!isExist) {
      return running - 1;
    }
  }
}
async function runInstaller(version) {
  return new Promise(async (resolve, reject) => {
    try {
      // check if the binary exist. if not then use the old name
      if (!fsExtra.existsSync(config.ELA_SYSTEM_INSTALLER_PATH)) {
        config.ELA_SYSTEM_INSTALLER_PATH = path.join(
          config.ELA_SYSTEM_INSTALLER_DIR,
          "main"
        );
      }
      await fsExtra.copy(
        config.ELA_SYSTEM_INSTALLER_PATH,
        config.ELA_SYSTEM_TMP_INSTALLER
      );
      spawn("chmod", ["+x", config.ELA_SYSTEM_TMP_INSTALLER]);
      spawn(
        `${config.ELA_SYSTEM_TMP_INSTALLER}`,
        [`${config.TMP_PATH}/${version}.box`, "-s", "-l", "-r"],
        { detached: true, stdio: "ignore" }
      ).unref();
      spawn("ebox", ["terminate"]);
      //syslog.write(syslog.create().debug(`installing ${config.TMP_PATH}/${version}.box`))
      resolve("completed");
    } catch (error) {
      syslog.write(syslog.create().error("Failed installing update...", error));
      reject(error);
    }
  });
}
async function checkVersion() {
  const currentVersion = await getCurrentBuild();
  const latestVersion = await checkLatestBuild(currentVersion);
  let newUpdate = true;
  let count = 1;
  if (!config.isDebug && currentVersion === latestVersion) {
    newUpdate = false;
    count = 0;
  }
  return {
    current: currentVersion,
    latest: latestVersion,
    new_update: newUpdate,
    count: count,
  };
}
function downloadElaFile(destinationPath, version, extension = "box") {
  syslog.write(
    syslog
      .create()
      .debug(
        "Downloading update file @ " + destinationPath + " version " + version
      )
  );
  return filedownload(
    `${config.PACKAGES_URL}/${version}.${extension}`,
    `${destinationPath}/${version}.${extension}`,
    (percentage) => {
      eventhandler.broadcast(
        config.INSTALLER_PK_ID,
        config.ELA_SYSTEM_BROADCAST_ID_INSTALLER,
        {
          status: "downloading file",
          percent: percentage,
        }
      );
    }
  );
}
async function processUpdateVersion(req, res) {
  try {
    const checkVersionResponse = await checkVersion();
    if (checkVersionResponse.new_update) {
      await runInstaller(checkVersionResponse.latest);
      res.send(true);
      return;
    }
    res.send(false);
  } catch (error) {
    syslog.write(
      syslog.create().error("Failed initializing update", error).addStack()
    );
    res.status(500).send("Update error.");
  }
}
async function processCheckNewUpdates(req, res) {
  try {
    const checkVersionResponse = await checkVersion();
    res.send(JSON.stringify(checkVersionResponse));
  } catch (error) {
    res.status(500).send("Update error.");
  }
}

async function processDownloadPackage(req, res) {
  try {
    const path = config.TMP_PATH;
    const currentVersion = await getCurrentBuild();
    const version = await checkLatestBuild(currentVersion);
    downloadElaFile(path, version, "box")
      .then((res) => {
        //revert back
        eventhandler.broadcast(
          config.INSTALLER_PK_ID,
          config.ELA_INSTALLER_BROADCAST_INSTALL_DONE,
          {
            status: "download complete",
            percent: 0,
          }
        );
      })
      .catch((err) => {
        syslog.write(syslog.create().error('failed to initiate download update', err))
        //revert back
        eventhandler.broadcast(
          config.INSTALLER_PK_ID,
          config.ELA_INSTALLER_BROADCAST_INSTALL_ERROR,
          {
            status: "failed",
            reason: err.message,
            percent: 0,
          }
        );
      });

    res.send(true);
  } catch (error) {
    syslog.write(
      syslog
        .create()
        .error("Failed downloading update package", error)
        .addStack()
    );
    res.status(500).send("Download error.");
  }
}
//ota functions end
// define the router to use
app.use("/", router);
app.use(require('./utilities/systemcontrol.js')); 

const startServer = () => {
  app.listen(config.PORT, async function () {
    await keystore.migrateOldKeystore()
    //await mainchain.retrieveUTX("EdtCygxivZckETb5NcDpz4RVitNEFyRWm2")
    syslog.write(
      syslog.create().info("Companion start running on " + config.PORT)
    );
    checkProcessingRunning("ela-bootstrapd").then((running) => {
      if (!running)
        restartCarrier((response) => {
          syslog.write(
            syslog.create().debug("Carrier restart response " + response)
          );
        });
    });
    await mainchain.init();
    mainchain.setOnComplete(async () => {  
      await esc.init()
      esc.setOnComplete( async ()=>{
          await eid.init();
          await eid.setOnComplete();
      })      
    });
  });
};

startServer();

process
  .on("unhandledRejection", (reason, p) => {
    syslog.write(syslog.create().error("Unhandled rejection", reason).addCaller())
  })
  .on("uncaughtException", (err) => {
    syslog.write(syslog.create().error("Uncaught Exception thrown", err).addCaller())
    //process.exit(1);
  });


module.exports = { app, startServer };
