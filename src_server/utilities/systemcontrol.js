const eventhandler = require("../helper/eventHandler");
var exec =  require('child_process').exec;
const syslog = require("../logger");

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


module.exports = router;