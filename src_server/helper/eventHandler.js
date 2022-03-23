const io = require("socket.io-client")
const config = require("../config")
const syslog = require("../logger")

//socket server
const broadcast_server = io(config.INSTALLER_SOCKET_URL, {
    transports: ["websocket"],
})

broadcast_server.on("connect_error", (response) => {
    syslog.write(syslog.create().error("Event server error", response).addCaller().addCategory("event"))
})

// use to broadcast action to event server
async function broadcast(packageId, actionId, broadcast_data) {
    broadcast_server.emit(
      config.ELA_SYSTEM,
      {
        id: config.ELA_SYSTEM_BROADCAST,
        data: JSON.stringify({
          id: actionId,
          packageId,
          data: broadcast_data,
        }),
      },
      (response) => {
        //syslog.write(syslog.create().debug(`Broadcast ${actionId} with response ${response}`).addCategory("event"))
      }
    )
}

async function RPC(packageId, actionId, data) {
    return new Promise((resolve, reject) => {
        broadcast_server.emit(
          config.ELA_SYSTEM,
          {
            id: config.ELA_SYSTEM_RPC,
            packageId: packageId,
            data: {
              id: actionId,
              data: data
            },
          },
          (response) => {
            resolve(response)
          }
        )
    })
}


module.exports = {
    broadcast: broadcast,
    RPC: RPC
}