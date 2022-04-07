const processhelper = require("./helper");
const delay = require("delay")
const { exec } = require("child_process")
const config = require("./config")
const maxBufferSize = 10000
const syslog = require("./logger");
const { isPortTaken } = require("./utilities/isPortTaken");
const binaryName = "ela.mainchain"
const { eboxEventInstance } = require("./helper/eventHandler");
const { 
  ELA_SYSTEM_RESTART_APP, 
  ELA_SYSTEM_TERMINATE_APP, 
  ELA_SYSTEM_CLEAR_APP_DATA 
} = require("./config");

// contains procedures that manages the mainchain process 
class MainchainHandler {
    async init() {
        syslog.write(syslog.create().debug("Starting mainchain...").addCategory("mainchain"))
        await this.start((response) => {
          syslog.write(syslog.create().debug(`Mainchain start response ${response}`).addCategory("mainchain"))
        })
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
    // get the current status of eid. this returns the state and blocks
    async getStatus() {
        const isRunning = await processhelper.checkProcessingRunning(binaryName)
        const servicesRunning = await isPortTaken(config.ELA_PORT)

        if (!isRunning || !servicesRunning ) {
            return { isRunning, servicesRunning }
        }

        try {
            const blockCountResponse = await processhelper.execShell(
                `curl -X POST http://User:Password@localhost:${config.ELA_PORT} -H "Content-Type: application/json" -d \'{"method": "getblockcount"}\' `,
                { maxBuffer: 1024 * maxBufferSize }
            )
        
            const blockCount = JSON.parse(blockCountResponse).result
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
        
            return {
                blockCount: blockCount - 1,
                blockSizes: blockSizeList,
                nbOfTxs: nbOfTxList,
                isRunning: isRunning,
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
}

module.exports = MainchainHandler