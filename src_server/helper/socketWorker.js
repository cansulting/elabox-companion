const workerpool = require('workerpool');
const Web3 = require("web3");
const config = require("../config");
const { default: axios } = require('axios');

async function ElaSocketEvent(result){
    const blockCount = result.height
    const blockSizeList = []
    const nbOfTxList = []
    const getBlockSize = (height) =>{
      return new Promise(function (resolve, reject) {
        axios.get("http://localhost:20334/api/v1/block/details/height/" + height)
        .then( res => resolve(res.data.Result))
        .catch( err => reject(err))
      })            
    }
    const getNbOfTx = (height) =>{
      return new Promise(function (resolve, reject) {
        axios.get("http://localhost:20334/api/v1/block/transactions/height/" + height)
        .then( res => resolve(res.data.Result.Transactions.length))
        .catch( err => reject(err))
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
async function EscSocketEvent(latestBlock){
    const web3 = new Web3(`ws://localhost:${config.ESC_PORT}`);
    const latestBlockN = latestBlock.number;
    const blockSizeList = [];
    const nbOfTxList = [];
    let bestBlockSize = 0;
    let bestBlockN = latestBlockN;
    let startingBlock = latestBlockN - 10;
    if (startingBlock <= 0) startingBlock = 0;
    for (let index = startingBlock; index < latestBlockN; index++) {
      const block = await web3.eth.getBlock(index);
      blockSizeList.push(block.size);
      if (block.size > bestBlockSize) {
        bestBlockSize = block.size;
        bestBlockN = block.number;
      }
      const txcount = await web3.eth.getBlockTransactionCount(index);
      nbOfTxList.push(txcount);
    }

    return {
      blockCount: bestBlockN,
      blockSizes: blockSizeList,
      nbOfTxs: nbOfTxList,
      latestBlock: {
        blockTime: latestBlock.timestamp,
        blockHash: latestBlock.hash,
        miner: latestBlock.miner,
      },
    };    
  }
  workerpool.worker({
    ElaSocketEvent,
    EscSocketEvent
  });
