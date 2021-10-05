var shell = require("shelljs");
const config = require("./config");
process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });
const runFeeds = () => {
  return new Promise((resolve, reject) => {
    shell.exec("sudo kill-port 10018");
    shell.exec(
      "nohup ./feedsd --config=./feedsd.conf > /dev/null &",
      {
        maxBuffer: 1024 * 500 * 10000,
        detached: true,
        cwd: config.FEEDS_DIR + "/",
      },

      (err, stdout, stderr) => {
        if (err) {
          console.log("Failed Feeds", err);
          reject(false);
          // throw (err)
        } else {
          console.log("Success Feeds", stdout);
          console.log("Warns Feeds", stderr);
          resolve(true);
        }
      }
    );
  });
};
module.exports = {
  runFeeds,
};
