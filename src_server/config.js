const path = require("path");
const homeapps = "/home/elabox/apps";
const homeappdata = "/home/elabox/data";
const eladatadir = homeappdata + "/ela.mainchain";
let elaPath = homeapps + "/ela.mainchain";
const cwd = path.join(__dirname, ".");
const storagePath = path.join(cwd, "/storage");
const tmpPath = path.join(storagePath, "tmp");
const elaSystemPath = "/usr/ela/system/ela.system/";
const elaSystemInfoPath = path.join(elaSystemPath, "info.json");
const elaInstallerPath = "/usr/ela/system/ela.installer/";
const elaSystemInstallerPath = path.join(elaInstallerPath, "main");
const elaTmpPath = "/tmp/ela";
const elaInstaller = path.join(elaTmpPath, "/main");
const buildMode = process.env.ELAENV || "DEBUG";
const elaboxVersion = process.env.ELAVERSION;
console.log(buildMode + " MODE");
console.log("Version " + elaboxVersion);
console.log("Binaries are on", homeapps);

module.exports = {
  SUPERNODE: homeapps,
  ESC_DIR: homeapps + "/ela.esc",
  EID_DIR: homeapps + "/ela.eid",
  ELA_DIR: elaPath, //
  ELADATA_DIR: eladatadir, // where keystore will be saved
  ELABLOCKS_DIR: eladatadir + "/elastos", // mainchain blocks will be save
  EIDDATA_DIR: homeappdata + "/ela.eid", // eid data directory
  ESCDATA_DIR: homeappdata + "/ela.esc",
  EID_PORT: 20645, // eid port that can be access for web3 api
  ESC_PORT: 20646,
  ELA_PORT: 20336,
  CARRIER_DIR: homeapps + "/ela.carrier", // carrier app directory
  KEYSTORE_PATH: eladatadir + "/keystore.dat", // keystore data path
  SUPPORT_EMAIL: "contact@elabox.com",
  STORAGE_PATH: storagePath,
  TMP_PATH: tmpPath, // where files will be temporary save. specifically use for installer
  ELA_SYSTEM_PATH: elaSystemPath, // dir where the system apps installed
  ELA_SYSTEM_INFO_PATH: elaSystemInfoPath, // where information about the system installed
  ELA_SYSTEM_INSTALLER_PATH: elaSystemInstallerPath, // dir for installer binary
  ELA_SYSTEM_TMP_PATH: elaTmpPath, // temp/cache path
  ELA_SYSTEM_TMP_INSTALLER: elaInstaller, // the path where temp installer will be copied during system update
  ELA_SYSTEM: "ela.system",
  ELA_EID: "ela.eid",
  ELA_EID_UPDATE_ACTION: "ela.eid.action.UPDATE",
  ELA_SYSTEM_BROADCAST: "ela.system.BROADCAST",
  INSTALLER_PK_ID: "ela.installer",
  ELA_SYSTEM_BROADCAST_ID_INSTALLER: "ela.installer.PROGRESS",
  BUILD_MODE: buildMode,
  ELABOX_VERSION: elaboxVersion, // current version of elabox
  PACKAGES_URL:
    buildMode === "RELEASE"
      ? "https://storage.googleapis.com/elabox/packages"
      : buildMode === "DEBUG"
      ? "https://storage.googleapis.com/elabox-debug/packages"
      : "https://storage.googleapis.com/elabox-staging/packages", // path where we download the packages
  POSTMARK_SERVER_TOKEN: "6a7b4fdc-717a-4981-a361-8ca17172df0a",
  POSTMARK_FROM_EMAIL: "info@elabox.com",
  INSTALLER_SOCKET_URL: "http://localhost",
  PORT: process.env.PORT || 3001,
};
