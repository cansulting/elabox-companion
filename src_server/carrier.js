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

shell.exec(
  "./ela-bootstrapd --config=bootstrapd.conf --foreground",
  {
    maxBuffer: 1024 * 500 * 10000,
    detached: true,
    cwd: config.CARRIER_DIR + "/",
  },

  (err, stdout, stderr) => {
    if (err) {
      console.log("Failed CP", err);
      // throw (err)
    } else {
      console.log("Success CP", stdout);
      console.log("Warns CP", stderr);
    }
  }
);
