const processhelper = require("./helper");
const eventhandler = require("./helper/eventHandler")
const delay = require("delay")
//const WebSocket = require("ws")
const Web3 = require("web3")
const config = require("./config");
const { json } = require("body-parser");
const isPortReachable = require("is-port-reachable")
const GETH = "geth"
const GETHWS = "ws://localhost:" + config.EID_PORT
const GETHWS_RECON = 5000;
const binarypath = config.EID_DIR
const datapath = config.EIDDATA_DIR + "/blocks"
const maxBufferSize = 10000
let web3


async function init() {
    await start((response) => {
        console.log(response)
    })
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

async function start(callback = () => {}) {
    if ( !await processhelper.checkProcessingRunning(GETH)) {
        console.log("Starting EID...")
        await processhelper.requestSpawn(
            `echo "\n" | ./${GETH} --datadir ${datapath} --syncmode "full" --ws --wsport ${config.EID_PORT} --wsapi eth,web3 > /dev/null 2>output &`, callback, {
            maxBuffer: 1024 * maxBufferSize,
            detached: true,
            shell: true,
            cwd: binarypath,
        })
    } else {
        console.log("EID Already started...")
    }
}

async function restart(callback) {
    console.log("Restarting EID")
    web3 = null
    await processhelper.killProcess(GETH, true)
    await delay(5000)
    await start(callback)
}

function isSyncing() {
    return web3.eth.isSyncing()
}

async function resync(callback) {
    console.log("Resyncing EID")
    web3 = null
    await processhelper.killProcess(GETH)
    await delay(1000)
    await processhelper.requestSpawn(
        `yes | ./${GETH} removedb --datadir ${datapath} > /dev/null 2>output &`, 
        async () => {
            await delay(2000)
            await start(callback)
        }, {
        maxBuffer: 1024 * maxBufferSize,
        detached: true,
        shell: true,
        cwd: binarypath,
    })
}

// get the current status of eid. this returns the state and blocks
async function getStatus() {
    try {
        const isRunning = await processhelper.checkProcessingRunning(GETH)
        let servicesRunning = await isPortReachable(config.EID_PORT, { host: "localhost" })
        // if (servicesRunning) {
        //     try {
        //         servicesRunning = !await isSyncing()
        //     }catch( e) {
        //         servicesRunning = false
        //     }
        // }
        //console.log(await isSyncing())
        if (!isRunning || !servicesRunning ) {
            return { isRunning, servicesRunning }
        }
        if (!web3) 
            web3 = new Web3(GETHWS)

        // get last 10 latest blocks
        let latestBlock = await web3.eth.getBlock("latest");
        const latestBlockN =latestBlock.number;
        const blockSizeList = []
        const nbOfTxList = []
        let blockCount = 0
        let startingBlock = latestBlockN - 10
        if (startingBlock <= 0)
            startingBlock = 0
        for (let index = startingBlock; index < latestBlockN; index++) {
            blockCount ++
            const block = await web3.eth.getBlock(index)
            blockSizeList.push(block.size)
            const txcount = await web3.eth.getBlockTransactionCount(index)
            nbOfTxList.push(txcount)
        }

        return {
            isRunning: isRunning,
            servicesRunning,
            blockCount: blockCount,
            blockSizes: blockSizeList,
            nbOfTxs: nbOfTxList,
            latestBlock: {
                blockTime: latestBlock.timestamp,
                blockHash: latestBlock.hash,
                miner: latestBlock.miner,
            },
        }
    } catch (err) {
        throw err
    }
}


module.exports = {
    init: init,
    start: start,
    restart: restart,
    resync: resync,
    getStatus: getStatus,
    isSyncing, isSyncing
}