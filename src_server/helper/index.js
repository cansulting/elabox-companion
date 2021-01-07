var shell = require("shelljs");

const execShell = (cmd, opts) => {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, opts, (error, stdout) => {
      if (error) {
        console.log("error: ", error);
        reject(error);
      }

      resolve(stdout);
    });
  });
};

const checkProcessingRunning = async (process) => {
  try {
    const processID = await execShell(`pidof -zx ${process}`);

    if (processID) console.log(`${process} running with ID ${processID}`);
    else console.log(`process ${process} is not found`);

    return processID ? true : false;
  } catch (err) {
    console.log(`process ${process} is not found`);
    return false;
  }
};

module.exports = { execShell, checkProcessingRunning };
