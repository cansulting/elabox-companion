const eventhandler = require("../helper/eventHandler");
const urlExist = require("url-exist");
// to allow cross-origin request
const cors = require("cors");
const bodyParser = require("body-parser");
var exec =  require('child_process').exec;
const logger = require("morgan");
const fs = require("fs");
const config = require("../config");
const utils = require(".");
const syslog = require("../logger");
var errorHandler = require("errorhandler");
const crypto = require("crypto");

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

let keyStorePath = config.KEYSTORE_PATH;

const maxBufferSize = 10000

// create a routes folder and add routes there
var express = require('express');
var multer = require('multer');
var router = express.Router();

// Mutler for storage of keystore dat file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.ELADATA_DIR)
  },
  filename: function (req, file, cb) {
    cb(null, 'keystore.dat')
  }
})

var storage_temp = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.ELADATA_TEMP_DIR)
  },
  filename: function (req, file, cb) {
    cb(null, 'keystore.dat')
  }
})

var uploads = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "application/octet-stream") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .dat format allowed!'));
    }
  }
});

var uploads_temp = multer({
  storage: storage_temp,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "application/octet-stream") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .dat format allowed!'));
    }
  }
});

router.post("/shutdown", (req, res) => {
  syslog.create().info("SHUTDOWN COMMAND RECIEVED").addCategory("system")
  exec(
    "shutdown -h now",
    { maxBuffer: 1024 * maxBufferSize },

  );
});

router.post("/restart", (req, res) => {
  syslog.create().info("RESTART COMMAND RECIEVED").addCategory("system")
  exec(
    "reboot",
    { maxBuffer: 1024 * maxBufferSize },

  );
});
router.get("/check_elabox_status",(req,res) => {
  res.send(true)
});

router.post("/changeWalletPassword",(req,res) => {
  let pwdhash = sha256(req.body.pwd);
  const fs = require('fs')
  fs.readFile(keyStorePath, 'utf8', (err, jsonString) => {
      if (err) {
          return;
      }

      var keystore = JSON.parse(jsonString);
      keystore.PasswordHash = pwdhash

      let data = JSON.stringify(keystore);
      fs.writeFileSync(keyStorePath, data);
    
      fs.readFile(keyStorePath, 'utf8', (err, jsonString) => {
        if (err) {
            return;
        }
        var keystore = JSON.parse(jsonString);
    
      })

  })

 




});

router.post('/import-keystore', uploads.single('keystore'), function(req, res, next) {
  syslog.create().info("Imported new keystore.").addCategory("system")
  console.log("Imported new keystore")
  console.log(req.file);
  return res.json({success: true});
  //...
});

router.post('/import-keystore-temp', uploads_temp.single('keystore'), function(req, res, next) {
  syslog.create().info("Imported temporary keystore.").addCategory("system")
  console.log("Imported temporary keystore")
  console.log(req.file);
  return res.json({success: true});
  //...
});



module.exports = router;