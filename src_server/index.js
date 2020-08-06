const express = require("express");
const app = express();
// to allow cross-origin request
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
// define port number
const port = process.env.PORT || 3001;
  const { exec } = require('child_process');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// create a routes folder and add routes there
const router = express.Router();

let elaPath = "/home/elabox/supernode/ela"

router.get('/', (req, res) => {
  res.send("HELLO WORLD");
});


router.get('/synced', (req, res) => {
  exec('ls /home/abilican/supernode/ela | grep keystore.dat',{maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
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
  exec('curl -X POST http://User:Password@localhost:20336 -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' ', {maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      // the *entire* stdout and stderr (buffered)
      // console.log(`stdout: ${stdout}`);
      // console.log(`stderr: ${stderr}`);
      let nodeinfo = stdout
      exec('curl http://User:Password@localhost:20606 -H "Content-Type: application/json" -d \'{"method": "getcurrentheight"}\' ', {maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err)
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
    exec('curl http://localhost:20334/api/v1/block/details/height/'+height+'',{maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
      if(err){
        reject(err)
      }
      else{
        let details = JSON.parse(stdout);
        resolve(details.Result)
      }
    })
  })
}


function getBlockSizeDid(height) {
  return new Promise(function (resolve, reject) {
    exec('curl http://localhost:20604/api/v1/block/details/height/'+height+'',{maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
      if(err){
        reject(err)
      }
      else{
        let details = JSON.parse(stdout);
        resolve(details.Result)
      }
    })
  })
}


router.get('/blocksizes', (req, res) => {
  exec('curl -X POST http://User:Password@localhost:20336 -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' ', {maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      let latestblockInfo = JSON.parse(stdout);
      let latestblockHeight = latestblockInfo.result
      var blockSizeList = []
      var counter = 0
      for (var i=latestblockHeight-10; i<latestblockHeight; i++){
        counter++;
        var blockSize = await getBlockSize(i);
        blockSizeList.push(blockSize.size)
      }
      if (counter == 10){
        // res.json({blockSizeList: blockSizeList, blockTime : blockSize.time, blockHash: blockSize.hash, miner: blockSize.minerinfo })

        exec('curl http://User:Password@localhost:20606 -H "Content-Type: application/json" -d \'{"method": "getcurrentheight"}\' ', {maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
          if (err) {
            //some err occurred
            console.error(err)
          } else {
            let latestblockInfoDiD = JSON.parse(stdout);
            let latestblockHeightDid = latestblockInfoDiD.result
            var blockSizeListDid = []
            var counter = 0
            for (var j=latestblockHeightDid-10; j<latestblockHeightDid; j++){
              counter++;
              var blockSizeDid = await getBlockSizeDid(j);
              blockSizeListDid.push(blockSizeDid.size)
            }
            if (counter == 10){
              res.json({blockSizeList: blockSizeList, blockTime : blockSize.time, blockHash: blockSize.hash, miner: blockSize.minerinfo, blockSizeListDid: blockSizeListDid, blockTimeDid : blockSizeDid.time, blockHashDid: blockSizeDid.hash, minerDid: blockSizeDid.minerinfo })
            }
          }
        });
      }
    }
  });
});


function getNbOfTx(height) {
  return new Promise(function (resolve, reject) {
    exec('curl http://localhost:20334/api/v1/block/transactions/height/'+height+'',{maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
      
    if(err){
        reject(err)
      }
      else{
        let details = JSON.parse(stdout);
        resolve(details.Result.Transactions.length)
      }
    })
  })
}


function getNbOfTxDid(height) {
  return new Promise(function (resolve, reject) {
    exec('curl http://localhost:20604/api/v1/block/transactions/height/'+height+'',{maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
      
    if(err){
        reject(err)
      }
      else{
        let details = JSON.parse(stdout);
        resolve(details.Result.Transactions.length)
      }
    })
  })
}


router.get('/nbOfTx', (req, res) => {
  exec('curl -X POST http://User:Password@localhost:20336 -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' ',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      // the *entire* stdout and stderr (buffered)
      let latestblockInfo = JSON.parse(stdout);
      let latestblockHeight = latestblockInfo.result

      var nbOfTxList = []
      var counter = 0
      for (var i=latestblockHeight-10; i<latestblockHeight; i++){
        counter++;
        var nbOfTx = await getNbOfTx(i)
        nbOfTxList.push(nbOfTx)
      }
      if (counter == 10){
        exec('curl http://User:Password@localhost:20606 -H "Content-Type: application/json" -d \'{"method": "getcurrentheight"}\' ',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
          if (err) {
            //some err occurred
            console.error(err)
          } else {
            let latestblockInfoDid = JSON.parse(stdout);
            let latestblockHeightDid = latestblockInfoDid.result
      
            var nbOfTxListDid = []
            var counter = 0
            for (var i=latestblockHeightDid-10; i<latestblockHeightDid; i++){
              counter++;
              var nbOfTxDid = await getNbOfTxDid(i)
              nbOfTxListDid.push(nbOfTxDid)
            }
            if (counter == 10){
              res.json({nbOfTxList, nbOfTxListDid})
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
  exec(elaPath+'/ela-cli wallet buildtx -w '+elaPath+'/keystore.dat --to '+recipient+' --amount '+amount+' --fee 0.001 --rpcuser User --rpcpassword Password '+pwd, {maxBuffer: 1024 * 500}, async (err, stdout) => {
    if (!err){
      // 2 - signtx
      exec(elaPath+'/ela-cli wallet signtx -w '+elaPath+'/keystore.dat -f to_be_signed.txn -p '+pwd, {maxBuffer: 1024 * 500}, async (err, stdout) => {
        if (!err){
          // 3 - sendtx
          exec(elaPath+'/ela-cli wallet sendtx -f ready_to_send.txn --rpcuser User --rpcpassword Password', {maxBuffer: 1024 * 500}, async (err, stdout) => {
            if (!err){
              res.json({ok: "ok"})
            }
            else {
              res.json({ok: "nope"})
            }
          }); 
        }
        else {
          res.json({ok: "nope"})
        } 
      }); 
    }
    else {
      res.json({ok: "nope"})
    }
  });
});


router.post('/login', (req, res) => {
  let pwd = req.body.pwd

  exec(elaPath+'/ela-cli wallet a -w '+elaPath+'/keystore.dat -p '+pwd+'', {maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    console.log("err", err)
    console.log("stdout", stdout)
    // console.log(stdout.split('\n')[2].split(' ')[0])
    if (err){
      res.json({ok: false})
    }
    else {
      res.json({ok: true, address: stdout.split('\n')[2].split(' ')[0] })
    }
  });
});


router.post('/createWallet', (req, res) => {
  let pwd = req.body.pwd1

  exec('cd '+elaPath+'; ./ela-cli wallet create -p '+pwd+'', {maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    console.log(stdout)
    // res.json({balance})
    res.json({ok: "ok"})
  });

  // console.log(pwd)
  res.json({ok: "ok"})
  
});

// let users download the wallet file
router.get('/downloadWallet', function(req, res){
  const file = `${elaPath}/keystore.dat`;
  res.download(file); 
});


router.post('/getBalance', (req, res) => {
  let address = req.body.address
  exec('curl http://localhost:20334/api/v1/asset/balances/'+address,{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    let balanceInfo = JSON.parse(stdout);
    let balance = balanceInfo.Result;
    res.json({balance})
  });
});


router.get('/checkInstallation', (req, res) => {
  exec('test -e run-fan.pdd && echo false || echo true',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    let configed = stdout
    exec('test -e /home/ubuntu/elabox/companion/maintenance.txt && echo true || echo false',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
      let maintenance = stdout
      res.json({configed, maintenance})
    });
  });
});


router.get('/serviceStatus', (req, res) => {
  exec('pidof ela',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    {stdout == "" ? elaRunning = false : elaRunning = true }
    exec('pidof did',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
      {stdout == "" ? didRunning = false : didRunning = true }
      exec('pidof token',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
        {stdout == "" ? tokenRunning = false : tokenRunning = true }
        exec('pidof ela-bootstrapd',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
          {stdout == "" ? carrierRunning = false : carrierRunning = true }
          exec('curl -s ipinfo.io/ip',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
            res.json({elaRunning, didRunning, tokenRunning, carrierRunning, carrierIp:stdout})
          });
        });
      });
    });
  });
});


router.post('/update', (req, res) => {
  let version = req.body.version
  // create a tmp file to know that it's updating
  exec('touch maintenance.txt', {maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    // download zip of the new version
    exec('wget ....'+version, {maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    });
  });
});


// let users download the wallet file
router.get('/downloadWallet', function(req, res){
  const file = `${elaPath}/keystore.dat`;
  res.download(file);
});


router.post('/restartMainchain', (req, res) => {
  let pwd = req.body.pwd
  exec('pidof ela',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    exec('kill '+stdout,{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
      exec('echo '+pwd+' | nohup '+elaPath+'/ela > /dev/null 2>output &',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
        res.json({success: 'ok'})
      });
    });
  });
});

router.post('/restartDid', (req, res) => {
  exec('pidof did',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
    exec('kill '+stdout,{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
      exec('nohup '+elaPath+'/did > /dev/null 2>output &',{maxBuffer: 1024 * 500}, async (err, stdout, stderr) => {
        res.json({success: 'ok'})
      });
    });
  });
});


// define the router to use
app.use('/', router);

app.listen(port, function () {
  console.log("Runnning on " + port);
});

module.exports = app;