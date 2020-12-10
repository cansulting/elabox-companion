const shell = require("shelljs");

const execShell = (cmd, opts) =>
  new Promise((resolve, reject) => {
    shell.exec(cmd, opts, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (stderr) {
        reject(stderr);
      }

      resolve(stdout);
    });
  });

module.exports = { execShell };
