const processhelper = require("./helper");
const workerpool = require('workerpool');
const pool = workerpool.pool("./helper/socketWorker");
const delay = require("delay");
const WebSocket = require("ws");
const { exec } = require("child_process");
const config = require("./config");
const maxBufferSize = 10000
const syslog = require("./logger");
const { isPortTaken } = require("./utilities/isPortTaken");
const binaryName = "ela.mainchain"
const { eboxEventInstance , broadcast } = require("./helper/eventHandler");
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
        this.listen()
    }
    listen() {
          let ws;
          try {
              ws = new WebSocket(`ws://localhost:${config.ELA_SOCKET_PORT}`)
          }catch(e) {
              console.log("Ela socket error", e)
          }
          ws.on("open", () => {
            syslog.write(syslog.create().info(`Ela socket connected.`).addCategory("mainchain"))
          })
          ws.on("close", (code, reason) => {
              setTimeout(()=>{
                this.listen()
              }, 5000)
          })
          ws.on("message",(data) => {
              const output = Buffer.from(data).toString()
              const result = JSON.parse(output).Result
              if(result.height || result.Height){
                pool.exec('ElaSocketEvent',[result])
                .then(result => {
                  if (!result.blockCount) return
                  //console.log("mainchain needs to be updated", result)
                  broadcast("ela.mainchain", "ela.mainchain.action.UPDATE",result)                      
                })
                .catch(err => 
                  syslog.write(syslog.create().error("mainchain pool error", err)))
              }
          })
          ws.on("error", (err) => {
              console.log("Ela websocket error.")            
              syslog.write(syslog.create().error("Uncaught Exception thrown", err).addCaller())            
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
        // let the system handle the starting of mainchain
        return 
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
            console.log(blockCount === null)
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
    async retrieveUTX(isRemote,walletAddr = "") {
      const wallet_transaction_url = isRemote ? config.REMOTE_WALLET_TRANSACTION_URL : config.WALLET_TRANSACTION_URL
      const utx_details_url = isRemote ? config.REMOTE_UTX_DETAILS_URL : config.UTX_DETAILS_URL
      const res = await fetch(wallet_transaction_url + "/" + walletAddr, {method: 'GET'})
      const json = await res.json()
      const txids = {}
      if (json.Error === 0) {
        const promises = []
        if(json.Result!== null) {
          for (const transacRes of json.Result) {
            if (transacRes.AssetName !== 'ELA') continue
            for (const itemUtx of transacRes.UTXO) {
              txids[itemUtx.Txid] = itemUtx.Value
              promises.push(
                fetch(utx_details_url + "/" + itemUtx.Txid, {method:'GET'})
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
      }
      return []
    }
}

const instance = new MainchainHandler()

module.exports = {
  instance: instance
}