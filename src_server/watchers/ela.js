var chokidar = require("chokidar");
var Tail = require("tail").Tail;

const ELA_LOG_DIR = "/home/elabox/supernode/ela/elastos/logs/node";

const REFCOVERING_START_PATTERN = /BLOCKCHAIN INITIALIZE STARTED/;
const REFCOVERING_FINISH_PATTERN = /Start services/;

var watcher = chokidar.watch(ELA_LOG_DIR, {
  persistent: true,
  ignoreInitial: true,
});

console.log(__dirname);

watcher.on("add", function (path) {
  console.log("File", path, "has been added");

  console.log("Tailing file");
  tail = new Tail(path);

  tail.on("line", function (data) {
    if (REFCOVERING_START_PATTERN.test(data)) {
      global.elaRecovering = true;
    } else if (REFCOVERING_FINISH_PATTERN.test(data)) {
      global.elaRecovering = false;
    }
  });
});
