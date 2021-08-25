const path = require("path")
const homeapps = "/home/elabox/apps"
const homeappdata = "/home/elabox/data"
const eladatadir = homeappdata + "/ela.mainchain" 
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
const buildMode = process.env.ELABUILD || "DEBUG"
console.log(buildMode + " MODE")
console.log("Binaries are on", homeapps)

module.exports = {
  SUPERNODE: homeapps,
  DID_DIR: homeapps + "/ela.did",
  ELA_DIR: elaPath,                                               //
  ELADATA_DIR: eladatadir,                                       // where keystore will be saved
  CARRIER_DIR: homeapps + "/ela.carrier",                        // carrier app directory
  KEYSTORE_PATH: eladatadir + "/keystore.dat",                   // keystore data path
  SUPPORT_EMAIL: "purujit.bansal9@gmail.com",
  STORAGE_PATH: storagePath,
  TMP_PATH: tmpPath,                                              // where files will be temporary save. specifically use for installer
  ELA_SYSTEM_PATH: elaSystemPath,                                 // dir where the system apps installed
  ELA_SYSTEM_INFO_PATH: elaSystemInfoPath,                        // where information about the system installed
  ELA_SYSTEM_INSTALLER_PATH: elaSystemInstallerPath,              // dir for installer binary
  ELA_SYSTEM_TMP_PATH: elaTmpPath,                                // temp/cache path
  ELA_SYSTEM_TMP_INSTALLER: elaInstaller,                         // the path where temp installer will be copied during system update
  ELA_SYSTEM: "ela.system",
  ELA_SYSTEM_BROADCAST: "ela.system.BROADCAST",
  INSTALLER_PK_ID: "ela.installer",
  ELA_SYSTEM_BROADCAST_ID_INSTALLER: "ela.installer.PROGRESS",
  BUILD_MODE: buildMode,
  ELA_BOX_PATH: buildMode === "RELEASE" ? 
    "https://storage.googleapis.com/elabox/packages" : (
    buildMode === "DEBUG" ?
      "https://storage.googleapis.com/elabox-debug/packages" :
      "https://storage.googleapis.com/elabox-staging/packages") ,      // path where we download the packages
  SENDGRID_API:
    "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",
  INSTALLER_SOCKET_URL: "http://localhost",
  PORT: process.env.PORT || 3001,
}
