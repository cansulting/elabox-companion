var shell = require("shelljs");
const config = require("./config");
const logger = require("./logger")

process
  .on("unhandledRejection", (reason, p) => {
    logger.write(logger.create().error("Unhandled rejection", reason).addCaller())
  })
  .on("uncaughtException", (err) => {
    logger.write(logger.create().error("Uncaught Exception thrown", err).addCaller())
    process.exit(1);
  });

shell.exec(
  "./ela-bootstrapd --config=bootstrapd.conf --foreground",
  {
    maxBuffer: 1024 * 500 * 10000,
    detached: true,
    cwd: config.CARRIER_DIR + "/",
  },

  (err, stdout, stderr) => {
    if (err) {
      logger.write(logger.create().error("Failed Carrier", err).addCategory("carrier").addCaller())
      // throw (err)
    } else {
      logger.write(logger.create().debug("Success Carrier " +stdout ))
      if (stderr)
        logger.write(logger.create().error("CP error", stderr).addCategory("carrier").addCaller())
    }
  }
);
