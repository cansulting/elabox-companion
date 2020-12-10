var shell = require("shelljs");

const execShell = (cmd, opts) => {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, opts, (error, stdout) => {
      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });
};
module.exports = { execShell };
