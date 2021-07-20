const binpath = "/home/elabox/supernode"
let elaPath = binpath + "/ela"
let keyStorePath = elaPath + "/keystore.dat"
console.log("Binaries are on", binpath)

module.exports = {
    SUPERNODE: binpath,
    DID_DIR: binpath + "/did",
    ELA_DIR: elaPath, 
    CARRIER_DIR: binpath + "/carrier",
    KEYSTORE_PATH : keyStorePath,
    SUPPORT_EMAIL: 'purujit.bansal9@gmail.com',
    SENDGRID_API: "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",
    PORT: process.env.PORT || 3001
}