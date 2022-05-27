
const mainchain = require("../mainchainHandler")
const dateFns = require("date-fns")

function retrieveTransactionElephant(address = "") { 
    return fetch(
        "https://node1.elaphant.app/api/3/history/" +
        address +
          "?pageNum=1&pageSize=10&order=desc"
      ).then((response) => response.json());
}

async function retrieveTransactionViaLocal(walletAddr = "") {
    return await mainchain.instance.retrieveUTX(walletAddr)
}

async function retrieveTransaction(walletAddr = "") {
    // const localRunning = await mainchain.instance.isRunning()
    // const latestBlock= await mainchain.instance.getStatus()
    // if(latestBlock !== undefined){
    //     const { blockTime } = latestBlock
    //     const timestamp = Date.now();
    //     const isSync = dateFns.differenceInDays(timestamp,blockTime * 1000) === 0
    //     if (localRunning && isSync) {
    //         return await retrieveTransactionViaLocal(walletAddr)
    //     }         
    // }
    return await retrieveTransactionElephant(walletAddr) 
}

module.exports = {
    retrieveUTX: retrieveTransaction
}