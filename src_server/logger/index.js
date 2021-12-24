const Log = require("./log")
const config = require("../config")
const fs = require("fs")
let logFile = null

const initLogVal = {
    package: config.COMPANION_PKID
}

function initLogFile() {
    if (!logFile) {
        logFile = fs.createWriteStream(config.LOG_FILE, {flags:'a'})
    }
}

// this creates new log
function create() {
    return new Log({...initLogVal})
}

// this write the log
async function write(log = new Log()) {
    initLogFile()
    const obj = log.toObject()
    if (config.BUILD_MODE !== 'RELEASE') {
        if (!obj.error)
            console.log(obj.level, ":", obj.message)
        else 
            console.log(obj.level, ":", obj.message, ", ERROR = ", obj.error)
    }
    const strl =log.toString() + "\n"
    //fs.appendFile(config.LOG_FILE, strl, () => {})
    //logFile.cork()
    await logFile.write(strl)
    //process.nextTick(() => logFile.uncork());
}

module.exports = {
    create: create,
    write: write
}