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

var carrierInfo = require(config.CARRIER_DIR + "/info.json");
var eidInfo = require(config.EID_DIR  + "/info.json");
var escInfo = require(config.ESC_DIR  + "/info.json");
var feedsInfo = require(config.FEEDS_DIR  + "/info.json");
var mainchainInfo = require(config.ELA_DIR  + "/info.json");

let keyStorePath = config.KEYSTORE_PATH;

const maxBufferSize = 10000

// create a routes folder and add routes there
var express = require('express');
var router = express.Router();


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

router.get("/version/mainchain",(req,res) => {
    res.send(mainchainInfo.version)
});

router.get("/version/carrier",(req,res) => {
  res.send(carrierInfo.version)
});

router.get("/version/eid",(req,res) => {
  res.send(eidInfo.version)
});

router.get("/version/esc",(req,res) => {
  res.send(escInfo.version)
});

router.get("/version/feeds",(req,res) => {
  res.send(feedsInfo.version)
});

router.get("/version/did",(req,res) => {
  res.send(feedsInfo.version)
});


module.exports = router;