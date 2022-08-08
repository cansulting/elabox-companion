
const mainchain = require("../mainchainHandler")
const dateFns = require("date-fns")

async function retrieveTransactionViaMainchain(walletAddr = "",isRemote = false) {
    return await mainchain.instance.retrieveUTX(walletAddr,isRemote)
}

async function retrieveTransaction(walletAddr = "") {
    const localRunning = await mainchain.instance.isRunning()
    const block= await mainchain.instance.getStatus()
    if(block !== undefined){
        const { latestBlock } = block
        if (latestBlock) {
            const { blockTime } = latestBlock
            const timestamp = Date.now();
            const isSync = dateFns.differenceInDays(timestamp,blockTime * 1000) === 0
            if (localRunning && isSync) {
                //use local mainchain
                return await retrieveTransactionViaMainchain(walletAddr)
            }         
        }
    }
    //use remote mainchain
    return await retrieveTransactionViaMainchain(walletAddr,true) 
}

module.exports = {
    retrieveUTX: retrieveTransaction
}