var shell = require("shelljs");
const { spawn } = require("child_process");
const delay = require("delay")
const syslog = require("../logger")

const execShell = (cmd, opts) => {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, opts, (error, stdout) => {
      if (error) {
        syslog.write(syslog.create().error(`Shell exec ${cmd} error`, error).addCaller())
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
      await execShell(`pkill -9 ${process}`);
      return
    }
    const processID = await execShell(`pidof -zx ${process}`);

    syslog.write(syslog.create().debug(`Killing process ${process}`))
    await execShell(`kill -9 ${processID.split(" ")[0]}`);
  } catch (err) {
    syslog.write(syslog.create().error(`Killing process ${process} error`, err).addCaller().addStack())
  }
};

// check if process name is currently running
const checkProcessingRunning = async (process) => {
  try {
    const processID = await execShell(`pidof -zx ${process}`);
    return processID ? true : false;
  } catch (err) {
    syslog.write(syslog.create().error(`Check running process ${process} error`, err).addCaller())
    return false;
  }
};

// spawn a command
const requestSpawn = async (
  command, 
  callback, 
  options, 
  delayValue = 1000) => {
  try {
    if (delayValue > 0)
      await delay(delayValue)

    const spawn_instance = spawn(command, options)
    spawn_instance.unref()
    if (spawn_instance.stdout) {
      spawn_instance.stdout.on("data", (data) => {
        syslog.write(syslog.create().debug(`Spawn ${command} response ${data}`))
      })
    }
    if (spawn_instance.stderr) {
      spawn_instance.stderr.on("data", (data) => {
        syslog.write(syslog.create().error(`Spawn ${command} error`, data).addCaller())
      })
    }
    spawn_instance.on("exit", (code, signal) => {
      if (!code) callback({ success: true })
      else callback({ success: false, error: signal })
    })
  } catch (err) {
    syslog.write(syslog.create().error(`Spawn ${command} error ${err.message}`, err).addCaller())
    callback({ success: false, error: err })
  }
}


module.exports = { execShell, checkProcessingRunning, killProcess, requestSpawn };
