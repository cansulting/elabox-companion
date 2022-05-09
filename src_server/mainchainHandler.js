const processhelper = require("./helper");
const delay = require("delay")
const { exec } = require("child_process")
const config = require("./config")
const maxBufferSize = 10000
const syslog = require("./logger");
const { isPortTaken } = require("./utilities/isPortTaken");
const binaryName = "ela.mainchain"
const { eboxEventInstance, broadcast } = require("./helper/eventHandler");
const { 
  ELA_SYSTEM_RESTART_APP, 
  ELA_SYSTEM_TERMINATE_APP, 
  ELA_SYSTEM_CLEAR_APP_DATA 
} = require("./config");


// contains procedures that manages the mainchain process 
class MainchainHandler {
    lastBlockCount = 0
    async init() {
        syslog.write(syslog.create().debug("Starting mainchain...").addCategory("mainchain"))        
        await this.start((response) => {
          syslog.write(syslog.create().debug(`Mainchain start response ${response}`).addCategory("mainchain"))
        })
    }
    async listen() {
      while(true){
        if(!await this.isBlockCountEqualToLatestBlockCount()){
          broadcast("ela.mainchain", "ela.mainchain.action.UPDATE")                                      
        }
        await delay(3000)        
      }
    }
    getBlockSize(height) {
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
      
    getNbOfTx(height) {
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

    async start(callback = () => {}) {
        if ( !await processhelper.checkProcessingRunning(binaryName)) {
          syslog.write(syslog.create().info(`Start spawning mainchain`).addCategory("mainchain"))
          await eboxEventInstance.sendSystemRPC(ELA_SYSTEM_RESTART_APP, binaryName)
          callback()
        } else {
            syslog.write(syslog.create().debug("Mainchain already started.").addCategory("mainchain"))
        }
    }
    // use to close and open the node again
    async restart(callback = () => {}) {
        syslog.write(syslog.create().info("Restarting mainchain...").addCategory("mainchain"))
        await eboxEventInstance.sendSystemRPC(ELA_SYSTEM_RESTART_APP, binaryName)
        callback()
    }
    // close the node and resync
    async resync(callback) {
        syslog.write(syslog.create().info("Resyncing mainchain...").addCategory("mainchain"))
        await this.stop()
        await eboxEventInstance.sendSystemRPC(ELA_SYSTEM_CLEAR_APP_DATA, binaryName)
        await this.start(callback)
    }
    async stop() {
      await eboxEventInstance.sendSystemRPC(ELA_SYSTEM_TERMINATE_APP, binaryName)
      // wait while process is not killed
      while (await processhelper.checkProcessingRunning(binaryName)) {
        await delay(1000);
      }
    }
    async isRunning() {
      const processRunning = await processhelper.checkProcessingRunning(binaryName)
      if (!processRunning) return false;
      const portRunning = await isPortTaken(config.ELA_PORT)
      return portRunning;
    }
    // get the current status of eid. this returns the state and blocks
    async getStatus() {
        const isRunning = await processhelper.checkProcessingRunning(binaryName)
        const servicesRunning = await isPortTaken(config.ELA_PORT)

        if (!isRunning || !servicesRunning ) {
            return { isRunning, servicesRunning }
        }

        try {
            const {blockCount, blockSizeList, nbOfTxList, latestBlock} = await this.retrieveBlocks()
            return {
              blockCount: blockCount - 1,
              blockSizes: blockSizeList,
              nbOfTxs: nbOfTxList,
              isRunning,
              servicesRunning,
              latestBlock: {
                  blockTime: latestBlock.time,
                  blockHash: latestBlock.hash,
                  miner: latestBlock.minerinfo,
              }
            }
        } catch (err) {
            syslog.write(syslog.create().error("Error while getting status", err).addStack().addCategory("mainchain"))
            throw err
        }
    }
    async setOnComplete(callback = () => {}) {
        let servicesRunning = await isPortTaken(config.ELA_PORT)
        if (!servicesRunning) {
            setTimeout(() => {
                this.setOnComplete(callback)
            }, 5000);
            return
        }
        callback()
    }
    async isBlockCountEqualToLatestBlockCount(){
      const blockCountResponse = await processhelper.execShell(
        `curl -X POST http://User:Password@localhost:${config.ELA_PORT} -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' `,
        { maxBuffer: 1024 * maxBufferSize }
      )
      const blockCount = JSON.parse(blockCountResponse).result
      if(blockCount === this.lastBlockCount){
        return true
      }
      return false;
    }
    async retrieveBlocks() {
      const blockCountResponse = await processhelper.execShell(
        `curl -X POST http://User:Password@localhost:${config.ELA_PORT} -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' `,
        { maxBuffer: 1024 * maxBufferSize }
      )
      const blockCount = JSON.parse(blockCountResponse).result      
      this.lastBlockCount = blockCount      
      const latestBlock = await this.getBlockSize(blockCount - 1)
      const blockSizeList = []
      const nbOfTxList = []
  
      for (let i = 0; i < blockCount - 1 && i < 10; i++) {
          const blockSize = await this.getBlockSize(blockCount - 1 - i)
          blockSizeList.push(blockSize.size)
      }
  
      for (let i = 0; i < blockCount - 1 && i < 10; i++) {
          const nbOfTx = await this.getNbOfTx(blockCount - 1 - i)
          nbOfTxList.push(nbOfTx)
      }
      return {blockCount, blockSizeList, nbOfTxList, latestBlock}
    }
    async retrieveUTX(walletAddr = "") {
      //console.log("retrieveUTX")
      const res = await fetch(config.WALLET_TRANSACTION_URL + "/" + walletAddr)
      const json = await res.json()
      const txids = {}
      //console.log(json)
      if (json.Error === 0) {
        const promises = []
        for (const transacRes of json.Result) {
          if (transacRes.AssetName !== 'ELA') continue
          for (const itemUtx of transacRes.UTXO) {
            txids[itemUtx.Txid] = itemUtx.Value
            promises.push(
              fetch(config.UTX_DETAILS_URL + "/" + itemUtx.Txid)
            )
          }
        }
        const utxList = await Promise.all(promises);
        const output = []
        let i = 0
        for (const detailedUtx of utxList) {
          const detailedJson = await detailedUtx.json()
          // console.log(detailedJson)
          let totalAmount = txids[detailedJson.Result.txid];
          const type = detailedJson.Result.vout[0].address === walletAddr ? "income": "expense"
          if (type === 'expense')
            totalAmount = detailedJson.Result.vout[0].value
          output[i] = {
            Value: parseFloat( totalAmount) * 100000000,
            Type: type,
            CreateTime: detailedJson.Result.time,
            Status: detailedJson.Result.confirmations > 0 ? "confirmed" : "pending",
            Txid: detailedJson.Result.txid
          }
          i++
        }
        return output.sort((a,b) => a.CreateTime < b.CreateTime ? 1 : -1)
        //console.log(output)
        //return output
      }
      return []
    }
}

const instance = new MainchainHandler()

module.exports = {
  instance: instance
}