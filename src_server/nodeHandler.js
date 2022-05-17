const processhelper = require("./helper");
const workerpool = require('workerpool');
const pool = workerpool.pool("./helper/socketWorker");
//const eventhandler = require("./helper/eventHandler")
const delay = require("delay");
const Web3 = require("web3");
const { isPortTaken } = require("./utilities/isPortTaken");
const syslog = require("./logger")

const { eboxEventInstance, broadcast } = require("./helper/eventHandler");
const { 
  ELA_SYSTEM_RESTART_APP, 
  ELA_SYSTEM_TERMINATE_APP, 
  ELA_SYSTEM_CLEAR_APP_DATA 
} = require("./config");


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
  constructor(options = { binaryName: "", cwd: "", dataPath: "", wsport: 0, rpcport: 0 }) {
    this.options = options;
    this.wspath = "ws://localhost:" + options.wsport;
    this.status = STOPPED;
  }
  async init() {
    await this.start()
    //setupWS()
  }

  listen() {
      if(this.options.binaryName === "ela.esc"){
        this.web3.eth.subscribe("newBlockHeaders",(err,latestBlocks)=>{
          if (!err){
            if(latestBlocks !== null){
              pool.exec("EscSocketEvent",[latestBlocks])
              .then(result => {
                broadcast("ela.esc", "ela.esc.action.UPDATE",result)                      
              }).catch(err=>{
                console.log(err)
              })
            }
          }
          return
        }).on("connected",()=>{
          syslog.write(syslog.create().info(`ela.esc socket connected.`).addCategory("ela.esc"))                    
        }).on("data",latestBlocks => {
          pool.exec("EscSocketEvent",[latestBlocks])
          .then(result => {
            broadcast("ela.esc", "ela.esc.action.UPDATE",result)                      
          })          
        }).on("error",err=>{
            syslog.write(syslog.create().error("Uncaught Exception thrown", err).addCaller())                      
        })
      }
  }
  _initWeb3() {
    if (this.web3) return
    this.web3 = new Web3(this.wspath);
  }

  async start(callback = () => {}) {
    if (
      !(await processhelper.checkProcessingRunning(this.options.binaryName))
    ) {
      this.status = STARTING;
      this.web3 = null;
      syslog.write(syslog.create().info(`Starting ${this.options.binaryName}`).addCategory(this.options.binaryName))
      // start the node
      await eboxEventInstance.sendSystemRPC(ELA_SYSTEM_RESTART_APP, this.options.binaryName)
      this.status = STARTED;
      callback()
    } else {
      syslog.write(syslog.create().info(`${this.options.binaryName} already started`).addCategory(this.options.binaryName))
    }
  }
  // use to close and open the node again
  async restart(callback = () => {}) {
    syslog.write(syslog.create().info(`Restarting ${this.options.binaryName}`).addCategory(this.options.binaryName))
    await eboxEventInstance.sendSystemRPC(ELA_SYSTEM_RESTART_APP, this.options.binaryName)
    callback()
  }
  isSyncing() {
    return this.web3.eth.isSyncing();
  }
  // close the node and resync
  async resync(callback) {
    syslog.write(syslog.create().info(`Resyncing ${this.options.binaryName}`).addCategory(this.options.binaryName))
    await this.stop();

    await eboxEventInstance.sendSystemRPC(ELA_SYSTEM_CLEAR_APP_DATA, this.options.binaryName)
    await this.start(callback)
  }

  async stop() {
    this.web3 = null;
    this.status = STOPPING;
    await eboxEventInstance.sendSystemRPC(ELA_SYSTEM_TERMINATE_APP, this.options.binaryName)
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
      this.setOnComplete(callback)
    } else this.setOnComplete(callback);
  }
}

module.exports = NodeHandler;
