const path = require("path")
const binpath = "/home/elabox/supernode"
let elaPath = binpath + "/ela"
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
  DID_DIR: binpath + "/did",
  ELA_DIR: elaPath,
  CARRIER_DIR: binpath + "/carrier",
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
  SENDGRID_API:
    "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",
  PORT: process.env.PORT || 3001,
}
