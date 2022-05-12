const workerpool = require('workerpool');
const { exec } = require("child_process");

const maxBufferSize = 10000

async function handleElaSocketEvent(result){
    const blockCount = result.height
    const blockSizeList = []
    const nbOfTxList = []
    const getBlockSize = (height) =>{
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
      })            
    }
    const getNbOfTx = (height) =>{
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
        reject(error)
      })            
    }
    for (let i = 0; i < blockCount - 1 && i < 10; i++) {
        const blockSize = await getBlockSize(blockCount - 1 - i)
        blockSizeList.push(blockSize.size)
    }
  
    for (let i = 0; i < blockCount - 1 && i < 10; i++) {
        const nbOfTx = await getNbOfTx(blockCount - 1 - i)
        nbOfTxList.push(nbOfTx)
    }      
    return {
      blockCount: blockCount - 1,
      blockSizes: blockSizeList,
      nbOfTxs: nbOfTxList,                    
      latestBlock: {
        blockTime: result.time,
        blockHash: result.hash,
        miner: result.minerinfo,
    }                    
    }
  }      

  workerpool.worker({
    handleElaSocketEvent
  });