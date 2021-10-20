var shell = require("shelljs");
const config = require("./config");
const logger = require("./logger");

process
  .on("unhandledRejection", (reason, p) => {
    logger.write(logger.create().error("Unhandled rejection", reason).addCaller())
  })
  .on("uncaughtException", (err) => {
    logger.write(logger.create().error("Uncaught Exception thrown", err).addCaller())
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
          logger.write(logger.create().error("Failed Feeds", err).addCaller())
          reject(false);
          // throw (err)
        } else {
          logger.write(logger.create().debug("Success Feeds " +stdout ))
          if (stderr)
            logger.write(logger.create().error("Feeds std error", stderr).addCaller())
          resolve(true);
        }
      }
    );
  });
};
module.exports = {
  runFeeds,
};
