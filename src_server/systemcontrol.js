const eventhandler = require("./helper/eventHandler");
const urlExist = require("url-exist");
// to allow cross-origin request
const cors = require("cors");
const bodyParser = require("body-parser");
var exec =  require('child_process').exec;
const logger = require("morgan");
const fs = require("fs");
const config = require("./config");
const utils = require("./utilities");
const syslog = require("./logger");
var errorHandler = require("errorhandler");

let keyStorePath = config.KEYSTORE_PATH;

const maxBufferSize = 10000

// create a routes folder and add routes there
var express = require('express');
var router = express.Router();


router.post("/shutdown", (req, res) => {
  syslog.create().info("SHUTDOWN COMMAND RECIEVED").addCategory("system")
  exec(
    "shutdown",
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


module.exports = router;