
const mainchain = require("../mainchainHandler")

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

function retrieveTransaction(walletAddr = "") {
    const localRunning = mainchain.instance.isRunning()
    if (localRunning) {
        return await retrieveTransactionViaLocal(walletAddr)
    } 

    return await retrieveTransactionElephant(walletAddr) 
}

module.exports = {
    retrieveUTX: retrieveTransaction
}