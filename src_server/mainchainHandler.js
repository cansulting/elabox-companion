const processhelper = require("./helper");
const delay = require("delay")
const { exec } = require("child_process")
const fs = require('fs')
const config = require("./config")
const isPortReachable = require("is-port-reachable")
const maxBufferSize = 10000
var proccessResult = null

// contains procedures that manages the mainchain process 
class MainchainHandler {
    async init() {
        await this.start((response) => {
            // Get errors if it appeared upon initialization.
            console.log("ERRORS COLLECTED: ", response)
            proccessResult = response.data
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
        }).catch((error) => {
          reject(error)
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
        if ( !await processhelper.checkProcessingRunning('ela')) {
            console.log(`Starting ela...`)
            await processhelper.requestSpawn(`./ela --datadir ${config.ELABLOCKS_DIR}`, callback, {
              maxBuffer: 1024 * maxBufferSize,
              detached: true,
              shell: true,
              cwd: config.ELA_DIR,
              },
              // Get errors if it appeared during initialization.
              async (err, stdout, stderr) => {
                console.log("GETTING SPAWN LOG")
                if (!stdout) {
                  console.log("No stdout")
                  console.log(stdout)
                }
                if (stderr) {
                  console.log("Error encountered during spawn ", stderr)
                  proccessResult = stderr
                }
              }
          )
        } else {
            console.log("ELA Already started...")
        }
    }
    // use to close and open the node again
    async restart(callback) {
        console.log("Restarting ela...")
        await processhelper.killProcess('ela')
        await delay(5000)
        await this.start(callback)
    }
    // close the node and resync
    async resync(callback) {
        console.log("Resyncing ela")
        await processhelper.killProcess('ela')
        await delay(1000)
        fs.rmdirSync(config.ELABLOCKS_DIR, { maxRetries: 3, force: true, recursive: true} )
        await this.start(callback)
    }

  


    // get the current status of eid. this returns the state and blocks
    async getStatus() {
        const isRunning = await processhelper.checkProcessingRunning('ela')
        console.log("ISRUNNING", isRunning)
        const servicesRunning = await isPortReachable(config.ELA_PORT, { host: "localhost" })
        console.log("SERVICESRUNNING", servicesRunning)
        const errorLogs = await processhelper.getErrorLog()
        if (errorLogs != ""){
          proccessResult = errorLogs
        }

        const nodestatus = await processhelper.execShell(
          `curl -X POST http://User:Password@localhost:${config.ELA_PORT} -H "Content-Type: application/json" -d \'{"method": "getnodestate"}\' `,
          { maxBuffer: 1024 * maxBufferSize }
        )

        
        // If there's an error within the node when it is online it is caught here
        const nodestatusError = JSON.parse(nodestatus).error
        proccessResult = nodestatusError

        // If there's an error within the node when it quitted or got corrupted it is caught 
        // on spawn stored on  `processResult` and sent here
        if (!isRunning || !servicesRunning ) {
            return { isRunning, servicesRunning, nodestatus: proccessResult }
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

            console.log("====PROCESS RESULT====")
            console.log(proccessResult)
            console.log("====/PROCESS RESULT====")

            return {
                blockCount: blockCount - 1,
                blockSizes: blockSizeList,
                nbOfTxs: nbOfTxList,
                isRunning: isRunning,
                servicesRunning,
                nodestatus: proccessResult,
                latestBlock: {
                    blockTime: latestBlock.time,
                    blockHash: latestBlock.hash,
                    miner: latestBlock.minerinfo,
                }
            }
        } catch (err) {
            throw err
        }
    }
    async setOnComplete(callback = () => {}) {
        let servicesRunning = await isPortReachable(config.ELA_PORT, { host: "localhost" })
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