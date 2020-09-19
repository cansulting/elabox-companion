const express = require("express");
const app = express();
// to allow cross-origin request
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const fs = require("fs");
var shell = require('shelljs');
var errorHandler = require('errorhandler')

// define port number
const port = process.env.PORT || 3001;
const { exec, fork, spawn } = require('child_process');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));
const maxBufferSize = 10000

// create a routes folder and add routes there
const router = express.Router();

let elaPath = "/home/elabox/supernode/ela"
let didPath = "/home/elabox/supernode/did"
let keyStorePath = elaPath + "/keystore.dat"
router.get('/', (req, res) => {
  res.send("HELLO WORLD");
});


router.get('/synced', (req, res) => {
  exec('ls /home/elabox/supernode/ela | grep keystore.dat', { maxBuffer: 1024 * maxBufferSize }, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }
  });
  res.json({ updated: true });
});


router.get('/latestblock', (req, res) => {
  exec('curl -X POST http://User:Password@localhost:20336 -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' ', { maxBuffer: 1024 * maxBufferSize }, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
      res.status(500)
    } else {
      // the *entire* stdout and stderr (buffered)
      // console.log(`stdout: ${stdout}`);
      // console.log(`stderr: ${stderr}`);
      let nodeinfo = stdout
      exec('curl http://User:Password@localhost:20606 -H "Content-Type: application/json" -d \'{"method": "getcurrentheight"}\' ', { maxBuffer: 1024 * maxBufferSize }, (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err)
          res.status(500)

        }
        else {
          res.json({ nodeinfo, nodeinfodid: stdout });
        }
      });
    }
  });
});


function getBlockSize(height) {
  return new Promise(function (resolve, reject) {
    exec('curl http://localhost:20334/api/v1/block/details/height/' + height + '', { maxBuffer: 1024 * maxBufferSize }, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }
      else {
        let details = JSON.parse(stdout);
        resolve(details.Result)
      }
    })
  }).catch(error => { console.log(error) })
}


function getBlockSizeDid(height) {
  return new Promise(function (resolve, reject) {
    exec('curl http://localhost:20604/api/v1/block/details/height/' + height + '', { maxBuffer: 1024 * maxBufferSize }, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }
      else {
        let details = JSON.parse(stdout);
        resolve(details.Result)
      }
    })
  }).catch(error => { console.log(error) })
}


router.get('/blocksizes', (req, res) => {
  exec('curl -X POST http://User:Password@localhost:20336 -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' ', { maxBuffer: 1024 * 500 }, async (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      let latestblockInfo = JSON.parse(stdout);
      let latestblockHeight = latestblockInfo.result
      var blockSizeList = []
      var counter = 0
      for (var i = latestblockHeight - 10; i < latestblockHeight; i++) {
        counter++;
        var blockSize = await getBlockSize(i);
        blockSizeList.push(blockSize.size)
      }
      if (counter == 10) {
        // res.json({blockSizeList: blockSizeList, blockTime : blockSize.time, blockHash: blockSize.hash, miner: blockSize.minerinfo })

        exec('curl http://User:Password@localhost:20606 -H "Content-Type: application/json" -d \'{"method": "getcurrentheight"}\' ', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
          if (err) {
            //some err occurred
            console.error(err)
          } else {
            let latestblockInfoDiD = JSON.parse(stdout);
            let latestblockHeightDid = latestblockInfoDiD.result
            var blockSizeListDid = []
            var counter = 0
            for (var j = latestblockHeightDid - 10; j < latestblockHeightDid; j++) {
              counter++;
              var blockSizeDid = await getBlockSizeDid(j);
              blockSizeListDid.push(blockSizeDid.size)
            }
            if (counter == 10) {
              res.json({ blockSizeList: blockSizeList, blockTime: blockSize.time, blockHash: blockSize.hash, miner: blockSize.minerinfo, blockSizeListDid: blockSizeListDid, blockTimeDid: blockSizeDid.time, blockHashDid: blockSizeDid.hash, minerDid: blockSizeDid.minerinfo })
            }
          }
        });
      }
    }
  });
});


function getNbOfTx(height) {
  return new Promise(function (resolve, reject) {
    exec('curl http://localhost:20334/api/v1/block/transactions/height/' + height + '', { maxBuffer: 1024 * maxBufferSize }, (err, stdout, stderr) => {

      if (err) {
        reject(err)
      }
      else {
        let details = JSON.parse(stdout);
        resolve(details.Result.Transactions.length)
      }
    })
  }).catch(error => { console.log(error) })
}


function getNbOfTxDid(height) {
  return new Promise(function (resolve, reject) {
    exec('curl http://localhost:20604/api/v1/block/transactions/height/' + height + '', { maxBuffer: 1024 * maxBufferSize }, (err, stdout, stderr) => {

      if (err) {
        reject(err)
      }
      else {
        let details = JSON.parse(stdout);
        resolve(details.Result.Transactions.length)
      }
    })
  }).catch(error => { console.log(error) })
}


router.get('/nbOfTx', (req, res) => {
  exec('curl -X POST http://User:Password@localhost:20336 -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' ', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      // the *entire* stdout and stderr (buffered)
      let latestblockInfo = JSON.parse(stdout);
      let latestblockHeight = latestblockInfo.result

      var nbOfTxList = []
      var counter = 0
      for (var i = latestblockHeight - 10; i < latestblockHeight; i++) {
        counter++;
        var nbOfTx = await getNbOfTx(i)
        nbOfTxList.push(nbOfTx)
      }
      if (counter == 10) {
        exec('curl http://User:Password@localhost:20606 -H "Content-Type: application/json" -d \'{"method": "getcurrentheight"}\' ', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
          if (err) {
            //some err occurred
            console.error(err)
          } else {
            let latestblockInfoDid = JSON.parse(stdout);
            let latestblockHeightDid = latestblockInfoDid.result

            var nbOfTxListDid = []
            var counter = 0
            for (var i = latestblockHeightDid - 10; i < latestblockHeightDid; i++) {
              counter++;
              var nbOfTxDid = await getNbOfTxDid(i)
              nbOfTxListDid.push(nbOfTxDid)
            }
            if (counter == 10) {
              res.json({ nbOfTxList, nbOfTxListDid })
            }
          }
        });
      }
    }
  });
});


router.post('/sendTx', (req, res) => {
  let amount = req.body.amount
  let recipient = req.body.recipient
  let pwd = req.body.pwd
  console.log(amount, recipient, pwd)

  // 1 - buildtx
  exec(elaPath + '/ela-cli wallet buildtx -w ' + elaPath + '/keystore.dat --to ' + recipient + ' --amount ' + amount + ' --fee 0.001 --rpcuser User --rpcpassword Password ' + pwd, { maxBuffer: 1024 * 500 }, async (err, stdout) => {
    if (!err) {
      // 2 - signtx
      exec(elaPath + '/ela-cli wallet signtx -w ' + elaPath + '/keystore.dat -f to_be_signed.txn -p ' + pwd, { maxBuffer: 1024 * maxBufferSize }, async (err, stdout) => {
        if (!err) {
          // 3 - sendtx
          exec(elaPath + '/ela-cli wallet sendtx -f ready_to_send.txn --rpcuser User --rpcpassword Password', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout) => {
            if (!err) {
              res.json({ ok: "ok" })
            }
            else {
              res.json({ ok: "nope" })
            }
          });
        }
        else {
          res.json({ ok: "nope" })
        }
      });
    }
    else {
      res.json({ ok: "nope" })
    }
  });
});


router.post('/login', (req, res) => {
  let pwd = req.body.pwd
  console.log("PASSWORD RECEIVED", pwd, req.body)
  exec(elaPath + '/ela-cli wallet a -w ' + elaPath + '/keystore.dat -p ' + pwd + '', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
    console.log("err", err)
    console.log("stdout", stdout)
    // console.log(stdout.split('\n')[2].split(' ')[0])
    if (err) {
      res.json({ ok: false })
    }
    else {
      res.json({ ok: true, address: stdout.split('\n')[2].split(' ')[0] })
    }
  });
});


router.post('/createWallet', (req, res) => {
  let pwd = req.body.pwd
  console.log("PASSWORD RECEIVED", pwd, req.body)


  exec('cd ' + elaPath + '; ./ela-cli wallet create -p ' + pwd + '', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
    console.log(stdout)
    // res.json({balance})
    res.json({ ok: "ok" })
  });

  // console.log(pwd)

});

// let users download the wallet file
router.get('/downloadWallet', function (req, res) {
  const file = `${elaPath}/keystore.dat`;
  res.download(file);
});


router.post('/getBalance', (req, res) => {
  let address = req.body.address
  exec('curl http://localhost:20334/api/v1/asset/balances/' + address, { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
    console.log("getBalance", stdout)
    let balanceInfo = JSON.parse(stdout);
    let balance = balanceInfo.Result;
    res.json({ balance })
  });
});


router.get('/checkInstallation', async (req, res) => {
  // exec('test -e run-fan.pdd && echo false || echo true',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
  //   let configed = stdout
  //   exec('test -e /home/ubuntu/elabox/companion/maintenance.txt && echo true || echo false',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
  //     let maintenance = stdout
  //     res.json({configed, maintenance})
  //   });
  // });

  res.send({ configed: JSON.stringify(await checkFile(keyStorePath)) })

});


router.get('/serviceStatus', (req, res) => {
  exec('pidof ela', { maxBuffer: 1024 * 500 }, async (err, stdout, stderr) => {
    { stdout == "" ? elaRunning = false : elaRunning = true }
    exec('pidof did', { maxBuffer: 1024 * 500 }, async (err, stdout, stderr) => {
      { stdout == "" ? didRunning = false : didRunning = true }
      // exec('pidof token', { maxBuffer: 1024 * 500 }, async (err, stdout, stderr) => {
      //   { stdout == "" ? tokenRunning = false : tokenRunning = true }
        exec('pidof ela-bootstrapd', { maxBuffer: 1024 * 500 }, async (err, stdout, stderr) => {
          { stdout == "" ? carrierRunning = false : carrierRunning = true }
          // exec('curl -s ipinfo.io/ip', { maxBuffer: 1024 * 500 }, async (err, stdout, stderr) => {
          //   res.json({ elaRunning, didRunning, tokenRunning, carrierRunning, carrierIp: stdout.trim() })
          // });
        });
      // });
    });
  });
});


router.post('/update', (req, res) => {
  let version = req.body.version
  // create a tmp file to know that it's updating
  exec('touch maintenance.txt', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
    // download zip of the new version
    exec('wget ....' + version, { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
    });
  });
});


// let users download the wallet file
router.get('/downloadWallet', function (req, res) {
  const file = `${elaPath}/keystore.dat`;
  res.download(file);
});


const restartMainchain = (pwd) => {
  return new Promise((resolve, reject) => {
    shell.exec('pidof ela', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
      console.log("restartMainchain", stdout)

      shell.exec('kill ' + stdout, { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
        console.log("restartMainchain", stdout)

        shell.exec('cd ' + elaPath + '; echo ' + pwd + ' | nohup ./ela > /dev/null 2>output &', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
          if (err) {
            console.error("restartMainchainErr", err)
          }
          console.log("restartMainchainOut", stdout)
          resolve({ success: 'ok' })
        });
      });
    });
  }).catch(error => { console.log(error) })
}



const restartDid = () => {
  console.log("Restarting DID")
  return new Promise((resolve, reject) => {
    exec('pidof did', { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
      exec('kill ' + stdout, { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
        console.log("DIDpath", didPath + "/did")
        shell.exec('cd ' + didPath + '; nohup ./did > /dev/null 2>output &', { maxBuffer: 1024 * maxBufferSize, cwd: didPath }, async (err, stdout, stderr) => {
          resolve({ success: 'ok' })
        });
      });
    });
  }).catch(error => { console.log(error) })
}

const runCarrier = () => {

  console.log("Running Carrier Script")

  var prom = new Promise((resolve, reject) => {
    // shell.cd("/home/elabox/supernode/carrier/")
    exec(
      "echo elabox | sudo -S ./ela-bootstrapd --config=bootstrapd.conf --foreground",
      { maxBuffer: 1024 * maxBufferSize * 10000, detached: true, cwd: "/home/elabox/supernode/carrier/" },

      (err, stdout, stderr) => {
        if (err) {
          console.log("Failed CP", err);
          // throw (err)

        } else {
          console.log("Success CP");
          resolve(stdout.trim())
        }
      }
    );
  }).catch(error => { console.log(error) })

  return prom;
}



const restartCarrier = () => {

  return new Promise((resolve, reject) => {
    console.log("Running Carrier Script")

    const install = fork("carrier.js", { detached: true });
    install.unref()

    install.on("message", (code) => {
      console.log(`Carrier message ${code}`);
    });

    install.on("close", (code) => {
      console.log(`Carrier child process exited with code ${code}`);
    });

    install.on("error", (code) => {
      console.log(`Carrier child process error with code ${code}`);
    });
    console.log("Spawned");
    resolve()
  }).catch(error => { console.log(error) })

}





// setInterval(restartCarrier, 1000 * 5)

router.post('/restartMainchain', async (req, res) => {
  let pwd = req.body.pwd
  res.json(await restartMainchain(pwd))

});




router.post('/restartDid', async (req, res) => {
  res.json(await restartDid())

});

router.post('/restartCarrier', async (req, res) => {
  res.json(await restartCarrier())

});


router.post('/restartAll', async (req, res) => {
  let pwd = req.body.pwd
  const results = await Promise.all([restartMainchain(pwd), restartDid(), restartCarrier()])
  console.log("RR", results)
  res.json(results)

});


router.get('/getOnion', async (req, res) => {
  res.send({ onion: await getOnionAddress() })

});

router.get('/regenerateOnion', async (req, res) => {
  await regenerateTor()
  res.send({ onion: await getOnionAddress() })

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
  }).catch(error => { console.log(error) })

  return prom;
};


const getOnionAddress = () => {

  return new Promise((resolve, reject) => {
    exec("echo elabox | sudo -S cat /var/lib/tor/elabox/hostname",
      { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {

        resolve(stdout.trim())
      })
  }).catch(error => { console.log(error) })
}

const regenerateTor = () => {

  return new Promise((resolve, reject) => {
    exec("echo elabox | sudo -S rm -rf /var/lib/tor/elabox",
      { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
        exec("echo elabox | sudo -S systemctl restart tor@default", { maxBuffer: 1024 * maxBufferSize }, async (err, stdout, stderr) => {
          resolve()
        })
      })
  }).catch(error => { console.log(error) })
}



// define the router to use
app.use('/', router);

app.listen(port, function () {
  console.log("Runnning on " + port);
});

module.exports = app;