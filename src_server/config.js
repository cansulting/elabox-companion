const path = require("path")
const binpath = "/home/elabox/apps"
let elaPath = binpath + "/ela.mainchain"
let keyStorePath = elaPath + "/keystore.dat"
const bucketName = "elabox"
const cwd = path.join(__dirname, ".")
const storagePath = path.join(cwd, "/storage")
const tmpPath = path.join(storagePath, "tmp")
const elaSystemPath = "/usr/ela/system/ela.system/"
const elaSystemInfoPath = path.join(elaSystemPath, "info.json")
const elaInstallerPath = "/usr/ela/system/ela.installer/"
const elaSystemInstallerPath = path.join(elaInstallerPath, "main")
const elaTmpPath = "/tmp/ela"
const elaInstaller = path.join(elaTmpPath, "/main")
console.log("Binaries are on", binpath)

module.exports = {
  SUPERNODE: binpath,
  DID_DIR: binpath + "/ela.did",
  ELA_DIR: elaPath,
  CARRIER_DIR: binpath + "/ela.carrier",
  KEYSTORE_PATH: keyStorePath,
  SUPPORT_EMAIL: "purujit.bansal9@gmail.com",
  BUCKET_NAME: bucketName,
  STORAGE_PATH: storagePath,
  TMP_PATH: tmpPath,
  ELA_SYSTEM_PATH: elaSystemPath,
  ELA_SYSTEM_INFO_PATH: elaSystemInfoPath,
  ELA_SYSTEM_INSTALLER_PATH: elaSystemInstallerPath,
  ELA_SYSTEM_TMP_PATH: elaTmpPath,
  ELA_SYSTEM_TMP_INSTALLER: elaInstaller,
  ELA_SYSTEM: "ela.system",
  ELA_SYSTEM_BROADCAST: "ela.system.BROADCAST",
  ELA_SYSTEM_BROADCAST_ID_INSTALLER: "ela.installer",
  SENDGRID_API:
    "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",
  INSTALLER_SOCKET_URL: "http://localhost:9000",
  PORT: process.env.PORT || 3001,
}
