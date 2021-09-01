var shell = require("shelljs");
const { spawn } = require("child_process");
const delay = require("delay")

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

// use to kill process
// @process name
// @all, if true kill all process and subprocess with the process name
const killProcess = async (process, all = false) => {
  try {
    if (all) {
      await execShell(`pkill ${process}`);
      return
    }
    const processID = await execShell(`pidof -zx ${process}`);

    console.log("killing process " + processID.split(" ")[0]);
    await execShell(`kill -9 ${processID.split(" ")[0]}`);
    console.log("process killed");
  } catch (err) {
    console.log(`process ${process} is not found`, 'error ', err);
  }
};

// check if process name is currently running
const checkProcessingRunning = async (process) => {
  try {
    const processID = await execShell(`pidof -zx ${process}`);

    if (processID) console.log(`${process} running with ID ${processID}`);
    //else console.log(`process ${process} is not found`);

    return processID ? true : false;
  } catch (err) {
    console.log(`process ${process} is not found`);
    return false;
  }
};

// spawn a command
const requestSpawn = async (command, callback, options) => {
  try {
    await delay(1000)

    const spawn_instance = spawn(command, options)
    spawn_instance.unref()

    spawn_instance.stdout.on("data", (data) => {
      console.log(`${data}`)
    })
    spawn_instance.stderr.on("data", (data) => {
      console.log(`ERROR ${data}`)
    })
    spawn_instance.on("exit", (code, signal) => {
      if (!code) callback({ sucess: true })
      else callback({ success: false, error: signal })
    })
  } catch (err) {
    console.log("Spawn error", err)
    callback({ success: false, error: err })
  }
}


module.exports = { execShell, checkProcessingRunning, killProcess, requestSpawn };
