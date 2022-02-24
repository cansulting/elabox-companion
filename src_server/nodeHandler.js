const processhelper = require("./helper");
//const eventhandler = require("./helper/eventHandler")
const delay = require("delay");
//const WebSocket = require("ws")
const Web3 = require("web3");
const { isPortTaken } = require("./utilities/isPortTaken");
const syslog = require("./logger")
//const GETHWS_RECON = 5000;
const maxBufferSize = 10000;
const fs = require('fs')

// class that manages nodes( ESC, EID and other related nodes) 
class NodeHandler {
  // @binaryName: name of binary to be executed
  // @cwd: path where binary is saved
  // @dataPath: path where data is saved
  // @wsport: port where ws api is accessible
  constructor(options = { binaryName: "", cwd: "", dataPath: "", wsport: 0, rpcport: 0, }) {
    this.options = options;
    this.wspath = "ws://127.0.0.1:" + options.wsport;
  }
  async init() {
    await this.start((response) => {
      syslog.write(syslog.create().debug(`${this.options.binaryName} start response ${response}`).addCategory(this.options.binaryName))
    });
    //setupWS()
  }

  // function setupWS() {
  //     let ws;
  //     try {
  //         ws = new WebSocket(GETHWS)
  //     }catch(e) {
  //         console.log("SetupWS error", e)
  //     }

  //     ws.on("open", () => {
  //         const input = {"id": 1, "method": "eth_subscribe", "params": ["syncing"]}
  //         ws.send(JSON.stringify(input), (err) => {
  //             if (err)
  //                 console.log("Sent ERROR", err)
  //         })

  //     })
  //     ws.on("close", (code, reason) => {
  //         console.log("Closed GETH WS", Buffer.from( reason).toString())
  //         console.log("Reconnecting")
  //         setTimeout(setupWS, GETHWS_RECON)
  //     })
  //     ws.on("message", (data) => {
  //         const output = Buffer.from(data).toString()
  //         console.log(output)
  //         //eventhandler.broadcast(config.ELA_EID, config.ELA_EID_UPDATE_ACTION, block)
  //     })
  //     ws.on("error", (err) => {
  //         console.log("GETH websocker error ")
  //     })
  // }
  _initWeb3() {
    if (!this.web3) this.web3 = new Web3(this.wspath);
  }

  async start(callback = () => {}) {
    if (
      !(await processhelper.checkProcessingRunning(this.options.binaryName))
    ) {
      syslog.write(syslog.create().info(`Starting ${this.options.binaryName}`).addCategory(this.options.binaryName))
      await processhelper.requestSpawn(
        `echo "\n" | ./${this.options.binaryName} --datadir ${this.options.dataPath} --syncmode "full" --rpc --rpcport ${this.options.rpcport} --ws --wsport ${this.options.wsport} --wsapi eth,web3 --rpccorsdomain "*" --rpcaddr "0.0.0.0" --rpcvhosts "*" --rpcapi admin,db,eth,miner,web3,net,personal,txpool --allow-insecure-unlock > /dev/null 2>output &`,
        callback,
        {
          maxBuffer: 1024 * maxBufferSize,
          detached: true,
          shell: true,
          cwd: this.options.cwd,
        }
      );
    } else {
      syslog.write(syslog.create().info(`${this.options.binaryName} already started`).addCategory(this.options.binaryName))
    }
  }
  // use to close and open the node again
  async restart(callback) {
    syslog.write(syslog.create().info(`Restarting ${this.options.binaryName}`).addCategory(this.options.binaryName))
    this.web3 = null;
    await processhelper.killProcess(this.options.binaryName, true);
    await delay(5000);
    await this.start(callback);
  }
  isSyncing() {
    return this.web3.eth.isSyncing();
  }
  // close the node and resync
  async resync(callback) {
    syslog.write(syslog.create().info(`Resyncing ${this.options.binaryName}`).addCategory(this.options.binaryName))
    this.web3 = null;
    await processhelper.killProcess(this.options.binaryName);
    await delay(1000);
    if (fs.existsSync(this.options.dataPath)) {
      fs.rmdirSync(this.options.dataPath, { maxRetries: 3, force: true, recursive: true} )
    }
    await this.start(callback)
  }
  // get the current status of eid. this returns the state and blocks
  async getStatus() {
    try {
      const isRunning = await processhelper.checkProcessingRunning(
        this.options.binaryName
      );
      let servicesRunning = await isPortTaken(this.options.wsport);
      //console.log(await isSyncing())
      if (!isRunning || !servicesRunning) {
        return { isRunning, servicesRunning };
      }
      this._initWeb3();

      // get last 10 latest blocks
      await delay(1000)
      let latestBlock = await this.web3.eth.getBlock("latest");
      const latestBlockN = latestBlock.number;
      const blockSizeList = [];
      const nbOfTxList = [];
      let bestBlockSize = 0;
      let bestBlockN = latestBlockN;
      let startingBlock = latestBlockN - 10;
      if (startingBlock <= 0) startingBlock = 0;
      for (let index = startingBlock; index < latestBlockN; index++) {
        const block = await this.web3.eth.getBlock(index);
        blockSizeList.push(block.size);
        if (block.size > bestBlockSize) {
          bestBlockSize = block.size;
          bestBlockN = block.number;
        }
        const txcount = await this.web3.eth.getBlockTransactionCount(index);
        nbOfTxList.push(txcount);
      }

      return {
        isRunning: isRunning,
        servicesRunning,
        blockCount: bestBlockN,
        blockSizes: blockSizeList,
        nbOfTxs: nbOfTxList,
        latestBlock: {
          blockTime: latestBlock.timestamp,
          blockHash: latestBlock.hash,
          miner: latestBlock.miner,
        },
      };
    } catch (err) {
      syslog.write(
        syslog.create().error(`Found error while getting status of ${this.options.binaryName}`, err)
        .addStack()
        .addCategory(this.options.binaryName))
      throw err;
    }
  }
  // set callback when node initialize successfully
  async setOnComplete(callback = () => {}) {
    if (this.web3 != null) {
      if (!(await this.isSyncing())) {
        callback();
      }
      return;
    }
    let servicesRunning = await isPortTaken(this.options.wsport);
    if (!servicesRunning) {
      setTimeout(() => {
        this.setOnComplete(callback);
      }, 5000);
      return;
    }
    this._initWeb3();
    if (await this.isSyncing()) {
      setTimeout(() => {
        this.setOnComplete(callback);
      }, 5000);
    } else this.setOnComplete(callback);
  }
}

module.exports = NodeHandler;
