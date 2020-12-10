const { exec, fork, spawn } = require("child_process");

const execShell = (cmd, opts) =>
  new Promise((resolve, reject) => {
    exec(cmd, opts, (error, stdout, stderr) => {
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
