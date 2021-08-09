const path = require("path")
const homeapps = "/home/elabox/apps"
const homeappdata = "/home/elabox/data"
const keystoredir = homeapps + "/ela.mainchain" 
let elaPath = homeapps + "/ela.mainchain"
const cwd = path.join(__dirname, ".")
const storagePath = path.join(cwd, "/storage")
const tmpPath = path.join(storagePath, "tmp")
const elaSystemPath = "/usr/ela/system/ela.system/"
const elaSystemInfoPath = path.join(elaSystemPath, "info.json")
const elaInstallerPath = "/usr/ela/system/ela.installer/"
const elaSystemInstallerPath = path.join(elaInstallerPath, "main")
const elaTmpPath = "/tmp/ela"
const elaInstaller = path.join(elaTmpPath, "/main")
console.log("Binaries are on", homeapps)

module.exports = {
  SUPERNODE: homeapps,
  DID_DIR: homeapps + "/ela.did",
  ELA_DIR: elaPath,
  KEYSTORE_DIR: keystoredir,                                      // where keystore will be saved
  CARRIER_DIR: homeapps + "/ela.carrier",
  KEYSTORE_PATH: keystoredir + "/keystore.dat",                   // keystore data path
  SUPPORT_EMAIL: "purujit.bansal9@gmail.com",
  STORAGE_PATH: storagePath,
  TMP_PATH: tmpPath,                                              
  ELA_SYSTEM_PATH: elaSystemPath,                                 // dir where the system apps installed
  ELA_SYSTEM_INFO_PATH: elaSystemInfoPath,                        // where information about the system installed
  ELA_SYSTEM_INSTALLER_PATH: elaSystemInstallerPath,              // dir for installer binary
  ELA_SYSTEM_TMP_PATH: elaTmpPath,                                // temp/cache path
  ELA_SYSTEM_TMP_INSTALLER: elaInstaller,                         // the path where temp installer will be copied during system update
  ELA_SYSTEM: "ela.system",
  ELA_SYSTEM_BROADCAST: "ela.system.BROADCAST",
  ELA_SYSTEM_BROADCAST_ID_INSTALLER: "ela.installer",
  ELA_BOX_PATH:"https://storage.googleapis.com/elabox/packages",  // path where we install the packages
  SENDGRID_API:
    "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",
  INSTALLER_SOCKET_URL: "http://localhost:9000",
  PORT: process.env.PORT || 3001,
}
