const path = require("path")
const feedsUrl = "http://localhost:10018/"
const feedsDir = "/home/elabox/apps/ela.feeds"
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
const packageInstallerName = "packageinstaller"
const elaSystemInstallerPath = path.join(elaInstallerPath, packageInstallerName)
const elaTmpPath = "/tmp/ela"
const elaInstaller = path.join(elaTmpPath, packageInstallerName)
const buildMode = process.env.ELABUILD || "DEBUG"
const elaboxVersion = process.env.ELAVERSION
console.log(buildMode + " MODE")
console.log("Version " + elaboxVersion)
console.log("Binaries @" + homeapps)

module.exports = {
  COMPANION_PKID: "ela.companion",                    // current companion package id
  SUPERNODE: homeapps,
  ESC_DIR: homeapps + "/ela.esc",                     // esc bin path
  EID_DIR: homeapps + "/ela.eid",                     // eid bin path
  ELA_DIR: elaPath,                                   // ela mainchain bin path
  ELADATA_DIR: eladatadir,                            // where keystore will be saved
  ELABLOCKS_DIR: eladatadir + "/elastos",             // mainchain blocks will be save
  EIDDATA_DIR: homeappdata + "/ela.eid",              // eid data directory
  ESCDATA_DIR: homeappdata + "/ela.esc",
  EID_PORT: 20645,                                    // eid port that can be access for web3 api
  ESC_PORT: 20646,                                    // esc port that can be access for web3 api
  ELA_PORT: 20336,
  CARRIER_DIR: homeapps + "/ela.carrier", // carrier app directory
  KEYSTORE_PATH: eladatadir + "/keystore.dat", // keystore data path
  SUPPORT_EMAIL: "contact@elabox.com",
  STORAGE_PATH: storagePath,
  TMP_PATH: tmpPath,                                  // where files will be temporary save. specifically use for installer
  ELA_SYSTEM_PATH: elaSystemPath,                     // dir where the system apps installed
  ELA_SYSTEM_INFO_PATH: elaSystemInfoPath,            // where information about the system installed
  ELA_SYSTEM_INSTALLER_PATH: elaSystemInstallerPath,  // dir for installer binary
  ELA_SYSTEM_TMP_PATH: elaTmpPath,                    // temp/cache path
  ELA_SYSTEM_TMP_INSTALLER: elaInstaller,             // the path where temp installer will be copied during system update
  ELA_SYSTEM: "ela.system",
  ELA_EID: "ela.eid",
  ELA_EID_UPDATE_ACTION: "ela.eid.action.UPDATE",     // action id for updating system
  ELA_SYSTEM_BROADCAST: "ela.system.BROADCAST",       // id for broadcasting message to system
  INSTALLER_PK_ID: "ela.installer",
  ELA_SYSTEM_BROADCAST_ID_INSTALLER: "ela.installer.PROGRESS", // installer action id that tells the companion front end it is in progress
  BUILD_MODE: buildMode,
  ELABOX_VERSION: elaboxVersion,                      // current version of elabox
  PACKAGES_URL:
    buildMode === "RELEASE"
      ? "https://storage.googleapis.com/elabox/packages"
      : buildMode === "DEBUG"
      ? "https://storage.googleapis.com/elabox-debug/packages"
      : "https://storage.googleapis.com/elabox-staging/packages", // path where we download the packages
  POSTMARK_SERVER_TOKEN: "6a7b4fdc-717a-4981-a361-8ca17172df0a",
  POSTMARK_FROM_EMAIL: "info@elabox.com",
  INSTALLER_SOCKET_URL: "http://localhost",
  FEEDS_URL: feedsUrl,
  FEEDS_DIR: feedsDir,
  PORT: process.env.PORT || 3001,                     // where companion server port will listen to
  LOG_FILE: "/var/log/elabox.log"                     // the log file
}
