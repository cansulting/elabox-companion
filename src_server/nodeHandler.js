const processhelper = require("./helper");
//const eventhandler = require("./helper/eventHandler")
const delay = require("delay");
//const WebSocket = require("ws")
const Web3 = require("web3");
const isPortReachable = require("is-port-reachable");
//const GETHWS_RECON = 5000;
const maxBufferSize = 10000;
var proccessResult = ""

// class that manages nodes( ESC, EID and other related nodes) 
class NodeHandler {
  // @binaryName: name of binary to be executed
  // @cwd: path where binary is saved
  // @dataPath: path where data is saved
  // @wsport: port where ws api is accessible
  constructor(options = { binaryName: "", cwd: "", dataPath: "", wsport: 0 }) {
    this.options = options;
    this.wspath = "ws://localhost:" + options.wsport;
  }
  async init() {
    await this.start((response) => {
      console.log(response)
      // Get errors if it appeared upon initialization.
      if (!response.success){
        if (response.error != ""){
          proccessResult = response.error
        }
      }
    });

    if(proccessResult == ""){
      proccessResult = await processhelper.getErrorLog() 
    }

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
      console.log(`Starting ${this.options.binaryName}...`);
      await processhelper.requestSpawn(
        `echo "\n" | ./${this.options.binaryName} --datadir ${this.options.dataPath} --syncmode "full" --ws --wsport ${this.options.wsport} --wsapi eth,web3 > /dev/null 2>output &`,
        callback,
        {
          maxBuffer: 1024 * maxBufferSize,
          detached: true,
          shell: true,
          cwd: this.options.cwd,
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
      );
    } else {
      console.log("EID Already started...");
    }
  }
  // use to close and open the node again
  async restart(callback) {
    console.log("Restarting " + this.options.binaryName);
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
    console.log("Resyncing " + this.options.binaryName);
    this.web3 = null;
    await processhelper.killProcess(this.options.binaryName);
    await delay(1000);
    await processhelper.requestSpawn(
      `yes | ./${this.options.binaryName} removedb --datadir ${this.options.dataPath} > /dev/null 2>output &`,
      async () => {
        await delay(2000);
        await start(callback);
      },
      {
        maxBuffer: 1024 * maxBufferSize,
        detached: true,
        shell: true,
        cwd: this.options.cwd,
      }
    );
  }
  // get the current status of eid. this returns the state and blocks
  async getStatus() {
    try {
      const isRunning = await processhelper.checkProcessingRunning(
        this.options.binaryName
      );

      const port = this.options.wsport

      let servicesRunning = await isPortReachable(port, {
        host: "localhost",
      });

      const errorLogs = await processhelper.getErrorLog()
      if (errorLogs != ""){
        proccessResult = errorLogs
      }

      //console.log(await isSyncing())
      if (!isRunning || !servicesRunning) {
          return { isRunning, servicesRunning, nodestatus: proccessResult }
      }
      this._initWeb3();

      // get last 10 latest blocks
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
        nodestatus: proccessResult,
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
      return err;
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
    let servicesRunning = await isPortReachable(this.options.wsport, {
      host: "localhost",
    });
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
