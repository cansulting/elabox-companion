const express = require("express");
const app = express();
// to allow cross-origin request
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const fs = require("fs");
var shell = require("shelljs");
var errorHandler = require("errorhandler");

// const NODE_URL = "localhost";
const NODE_URL = "192.168.18.71";

// define port number
const port = process.env.PORT || 3001;
const { exec, fork, spawn } = require("child_process");
const { execShell, checkProcessingRunning, killProcess } = require("./helper");
const isPortReachable = require("is-port-reachable");
const { json } = require("body-parser");
const delay = require("delay");
const { restart } = require("nodemon");

//TODO : make proper watchers and adapt to monorepo
// initializes log watchers
// require("./watchers");

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));
const maxBufferSize = 10000;

// create a routes folder and add routes there
const router = express.Router();

let elaPath = "/home/elabox/supernode/ela";
let didPath = "/home/elabox/supernode/did";
let keyStorePath = elaPath + "/keystore.dat";
router.get("/", (req, res) => {
  res.send("HELLO WORLD");
});

router.get("/synced", (req, res) => {
  exec(
    "ls /home/elabox/supernode/ela | grep keystore.dat",
    { maxBuffer: 1024 * maxBufferSize },
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err);
      } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    }
  );
  res.json({ updated: true });
});

router.get("/ela", async (req, res) => {
  const isRunning = await checkProcessingRunning("ela");

  const servicesRunning = await isPortReachable(20336, { host: "localhost" });

  console.log("ela serviceRunning", servicesRunning);

  if (!isRunning || !servicesRunning) {
    return res.json({ isRunning, servicesRunning });
  }

  try {
    const blockCountResponse = await execShell(
      `curl -X POST http://User:Password@localhost:20336 -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' `,
      { maxBuffer: 1024 * maxBufferSize }
    );

    const blockCount = JSON.parse(blockCountResponse).result;
    const latestBlock = await getBlockSize(blockCount - 1);
    const blockSizeList = [];
    const nbOfTxList = [];

    for (let i = 0; i < blockCount - 1 && i < 10; i++) {
      const blockSize = await getBlockSize(blockCount - 1 - i);
      blockSizeList.push(blockSize.size);
    }

    for (let i = 0; i < blockCount - 1 && i < 10; i++) {
      const nbOfTx = await getNbOfTx(blockCount - 1 - i);
      nbOfTxList.push(nbOfTx);
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
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.get("/did", async (req, res) => {
  try {
    const isRunning = await checkProcessingRunning("did");

    const servicesRunning = await isPortReachable(20606, { host: "localhost" });

    console.log("serviceRunning", servicesRunning);

    if (!isRunning || !servicesRunning) {
      return res.json({ isRunning, servicesRunning });
    }

    const blockCountResponse = await execShell(
      'curl http://User:Password@localhost:20606 -H "Content-Type: application/json" -d \'{"method": "getcurrentheight"}\' ',
      { maxBuffer: 1024 * maxBufferSize }
    );
    const blockCount = JSON.parse(blockCountResponse).result;

    const latestBlock = await getBlockSizeDid(blockCount);
    const blockSizeList = [];
    const nbOfTxList = [];

    for (let i = 0; i < blockCount && i < 10; i++) {
      const blockSize = await getBlockSizeDid(blockCount - i);
      blockSizeList.push(blockSize.size);
    }
    for (let i = 0; i < blockCount && i < 10; i++) {
      const nbOfTx = await getNbOfTxDid(blockCount - i);
      nbOfTxList.push(nbOfTx);
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
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.get("/carrier", async (req, res) => {
  try {
    const isRunning = await checkProcessingRunning("ela-bootstrapd");

    const carrierIP = await execShell("curl -s ipinfo.io/ip", {
      maxBuffer: 1024 * 500,
    });

    return res.status(200).json({ isRunning, carrierIP: carrierIP.trim() });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err });
  }
});

function getBlockSize(height) {
  return new Promise(function (resolve, reject) {
    exec(
      "curl http://localhost:20334/api/v1/block/details/height/" + height + "",
      { maxBuffer: 1024 * maxBufferSize },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          let details = JSON.parse(stdout);
          resolve(details.Result);
        }
      }
    );
  }).catch((error) => {
    console.log(error);
  });
}

function getBlockSizeDid(height) {
  return new Promise(function (resolve, reject) {
    exec(
      "curl http://localhost:20604/api/v1/block/details/height/" + height + "",
      { maxBuffer: 1024 * maxBufferSize },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          let details = JSON.parse(stdout);
          resolve(details.Result);
        }
      }
    );
  }).catch((error) => {
    console.log(error);
  });
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
          reject(err);
        } else {
          let details = JSON.parse(stdout);
          resolve(details.Result.Transactions.length);
        }
      }
    );
  }).catch((error) => {
    console.log(error);
  });
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
          reject(err);
        } else {
          let details = JSON.parse(stdout);
          resolve(details.Result.Transactions.length);
        }
      }
    );
  }).catch((error) => {
    console.log(error);
  });
}

router.post("/sendTx", (req, res) => {
  let amount = req.body.amount;
  let recipient = req.body.recipient;
  let pwd = req.body.pwd;
  console.log(amount, recipient, pwd);

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
                    res.json({ ok: "ok" });
                  } else {
                    res.json({ ok: "nope" });
                  }
                }
              );
            } else {
              res.json({ ok: "nope" });
            }
          }
        );
      } else {
        res.json({ ok: "nope" });
      }
    }
  );
});

router.post("/login", (req, res) => {
  let pwd = req.body.pwd;
  console.log("PASSWORD RECEIVED", pwd, req.body);
  exec(
    elaPath +
      "/ela-cli wallet a -w " +
      elaPath +
      "/keystore.dat -p " +
      pwd +
      "",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      console.log("err", err);
      console.log("stdout", stdout);
      // console.log(stdout.split('\n')[2].split(' ')[0])
      if (err) {
        res.json({ ok: false });
      } else {
        res.json({ ok: true, address: stdout.split("\n")[2].split(" ")[0] });
      }
    }
  );
});

router.post("/createWallet", (req, res) => {
  let pwd = req.body.pwd;
  console.log("PASSWORD RECEIVED", pwd, req.body);

  exec(
    "cd " + elaPath + "; ./ela-cli wallet create -p " + pwd + "",
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      console.log(stdout);
      // res.json({balance})
      res.json({ ok: "ok" });
    }
  );

  // console.log(pwd)
});

// let users download the wallet file
router.get("/downloadWallet", function (req, res) {
  const file = `${elaPath}/keystore.dat`;
  res.download(file);
});

router.post("/getBalance", (req, res) => {
  let address = req.body.address;
  exec(
    "curl http://localhost:20334/api/v1/asset/balances/" + address,
    { maxBuffer: 1024 * maxBufferSize },
    async (err, stdout, stderr) => {
      console.log("getBalance", stdout);
      let balanceInfo = JSON.parse(stdout);
      let balance = balanceInfo.Result;
      res.json({ balance });
    }
  );
});

router.get("/checkInstallation", async (req, res) => {
  // exec('test -e run-fan.pdd && echo false || echo true',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
  //   let configed = stdout
  //   exec('test -e /home/ubuntu/elabox/companion/maintenance.txt && echo true || echo false',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
  //     let maintenance = stdout
  //     res.json({configed, maintenance})
  //   });
  // });

  res.send({ configed: JSON.stringify(await checkFile(keyStorePath)) });
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

// let users download the wallet file
router.get("/downloadWallet", function (req, res) {
  const file = `${elaPath}/keystore.dat`;
  res.download(file);
});

const restartMainchain = async (callback) => {
  try {
    console.log("restartMainchain");

    await killProcess("ela");

    await delay(1000);

    const elaProcess = spawn(`nohup ./ela > /dev/null 2>output &`, {
      maxBuffer: 1024 * maxBufferSize,
      detached: true,
      shell: true,
      cwd: elaPath,
    });

    elaProcess.unref();

    elaProcess.stdout.on("data", (data) => {
      console.log(`data: ${data}`);
    });

    elaProcess.stderr.on("data", (data) => {
      console.log(`error: ${data}`);
    });

    elaProcess.on("exit", (code, signal) => {
      if (!code) {
        callback({ success: true });
      } else callback({ success: false, error: signal });
    });
  } catch (err) {
    callback({ success: false, error: err });
  }
};

const restartDid = async (callback) => {
  try {
    console.log("Restarting DID");

    await killProcess("did");

    await delay(1000);

    const didProcess = spawn(`nohup ./did > /dev/null 2>output &`, {
      maxBuffer: 1024 * maxBufferSize,
      detached: true,
      shell: true,
      cwd: didPath,
    });

    didProcess.unref();

    didProcess.stdout.on("data", (data) => {
      console.log(`data: ${data}`);
    });

    didProcess.on("exit", (code, signal) => {
      if (!code) {
        callback({ success: true });
      } else callback({ success: false, error: signal });
    });
  } catch (err) {
    callback({ success: false, error: err });
  }
};

const restartCarrier = async (callback) => {
  try {
    await killProcess("ela-bootstrapd");

    await delay(1000);

    const carrierSpawn = spawn(
      "./ela-bootstrapd --config=bootstrapd.conf --foreground",
      {
        maxBuffer: 1024 * 500 * 10000,
        detached: true,
        shell: true,
        cwd: "/home/elabox/supernode/carrier/",
      }
    );
    carrierSpawn.unref();

    carrierSpawn.stdout.on("data", (data) => {
      console.log(`${data}`);
    });

    carrierSpawn.on("exit", (code, signal) => {
      if (!code) callback({ sucess: true });
      else callback({ success: false, error: signal });
    });
  } catch (err) {
    callback({ success: false, error: err });
  }
};

router.post("/restartMainchain", async (req, res) => {
  await restartMainchain((resp) => res.json(resp));
});

router.post("/restartDid", async (req, res) => {
  await restartDid((resp) => res.json(resp));
});

router.post("/restartCarrier", async (req, res) => {
  await restartCarrier((resp) => res.json(resp));
});

router.get("/getOnion", async (req, res) => {
  res.send({ onion: await getOnionAddress() });
});

router.get("/regenerateOnion", async (req, res) => {
  await regenerateTor();
  res.send({ onion: await getOnionAddress() });
});

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
  }).catch((error) => {
    console.log(error);
  });

  return prom;
};

const getOnionAddress = () => {
  return new Promise((resolve, reject) => {
    exec(
      "echo elabox | sudo -S cat /var/lib/tor/elabox/hostname",
      { maxBuffer: 1024 * maxBufferSize },
      async (err, stdout, stderr) => {
        resolve(stdout.trim());
      }
    );
  }).catch((error) => {
    console.log(error);
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
            resolve();
          }
        );
      }
    );
  }).catch((error) => {
    console.log(error);
  });
};

// define the router to use
app.use("/", router);

app.listen(port, function () {
  console.log("Runnning on " + port);

  checkProcessingRunning("ela").then((running) => {
    if (!running) restartMainchain((response) => console.log(response));
  });

  checkProcessingRunning("did").then((running) => {
    if (!running) restartDid((response) => console.log(response));
  });

  checkProcessingRunning("ela-bootstrapd").then((running) => {
    if (!running) restartCarrier((response) => console.log(response));
  });
});

module.exports = app;
