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

// NODE STATES
const STARTING = 0;
const STARTED = 1;
const STOPPING = 2;
const STOPPED = 3;
const ERROR = 4;

// class that manages nodes( ESC, EID and other related nodes) 
class NodeHandler {
  // @binaryName: name of binary to be executed
  // @cwd: path where binary is saved
  // @dataPath: path where data is saved
  // @wsport: port where ws api is accessible
  constructor(options = { binaryName: "", cwd: "", dataPath: "", wsport: 0, rpcport: 0, }) {
    this.options = options;
    this.wspath = "ws://localhost:" + options.wsport;
    this.status = STOPPED;
  }
  async init() {
    await this.start();
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
    if (this.web3) return
    this.web3 = new Web3(this.wspath);
  //   var filter = this.web3.eth.subscribe('newBlockHeaders')
  // .on("connected", function(subscriptionId){
  //     console.log(subscriptionId);
  // })
  // .on("data", function(blockHeader){
  //     //console.log(blockHeader);
  // })
  // .on("error", console.error);
  }

  async start(callback = () => {}) {
    if (
      !(await processhelper.checkProcessingRunning(this.options.binaryName))
    ) {
      this.status = STARTING;
      this.web3 = null;
      syslog.write(syslog.create().info(`Starting ${this.options.binaryName}`).addCategory(this.options.binaryName))
      // callback when response received from node
      const _callback = (response) => {
        if (response.success) {
          syslog.write(syslog.create().debug(`${this.options.binaryName} started.`).addCategory(this.options.binaryName))
          this.status = STARTED;
        } else {
          syslog.write(
            syslog.create()
            .error(`${this.options.binaryName} failed to start.`, response.error)
            .addCategory(this.options.binaryName)
          )
          this.status = ERROR;
        } 
        callback(response);
      }
      // start the node
      await processhelper.requestSpawn(
        `nohup ./${this.options.binaryName} --datadir ${this.options.dataPath} --syncmode "full" --rpc --rpcport ${this.options.rpcport} --ws --wsport ${this.options.wsport} --wsapi eth,web3 --rpccorsdomain "*" --rpcaddr "0.0.0.0" --rpcvhosts "*" --rpcapi admin,db,eth,miner,web3,net,personal,txpool > /dev/null 2>output &`,
        _callback,
        {
          maxBuffer: 1024 * maxBufferSize,
          detached: true,
          shell: true,
          cwd: this.options.cwd,
          //stdio: "ignore"
        },
        0,
        //[`--datadir`, `${this.options.dataPath}`, `--syncmode`, `full`, `--rpc`, `--rpcport`, `${this.options.rpcport}`, `--ws`, `--wsport`, `${this.options.wsport}`, `--wsapi`, `eth,web3`]
      );
    } else {
      syslog.write(syslog.create().info(`${this.options.binaryName} already started`).addCategory(this.options.binaryName))
    }
  }
  // use to close and open the node again
  async restart(callback) {
    syslog.write(syslog.create().info(`Restarting ${this.options.binaryName}`).addCategory(this.options.binaryName))
    await this.stop();
    await this.start(callback);
  }
  isSyncing() {
    return this.web3.eth.isSyncing();
  }
  // close the node and resync
  async resync(callback) {
    syslog.write(syslog.create().info(`Resyncing ${this.options.binaryName}`).addCategory(this.options.binaryName))
    await this.stop();
    if (fs.existsSync(this.options.dataPath)) {
      fs.rmdirSync(this.options.dataPath, { maxRetries: 3, force: true, recursive: true} )
    }
    await this.start(callback)
  }

  async stop() {
    this.web3 = null;
    this.status = STOPPING;
    await processhelper.killProcess(this.options.binaryName, true, false);
    let retries = 0
    // wait while process is not killed
    while (await processhelper.checkProcessingRunning(this.options.binaryName)) {
      await delay(1000);
      retries++;
      if (retries > 20) 
        break;
    }
    this.status = STOPPED;
  }
  // get the current status of eid. this returns the state and blocks
  async getStatus() {
    try {
      let isRunning = await processhelper.checkProcessingRunning(
        this.options.binaryName
      );
      if (!isRunning && this.status !== STOPPED) 
        isRunning = true;
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
