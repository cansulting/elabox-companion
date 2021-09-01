const io = require("socket.io-client")
const config = require("../config")

//socket server
const broadcast_server = io(config.INSTALLER_SOCKET_URL, {
    transports: ["websocket"],
})

broadcast_server.on("connect_error", (response) => {
    console.log("Event Handler ERROR " + response)
})

// use to broadcast action to event server
async function broadcast(package, actionId, broadcast_data) {
    broadcast_server.emit(
      config.ELA_SYSTEM,
      {
        id: config.ELA_SYSTEM_BROADCAST,
        data: JSON.stringify({
          id: actionId,
          packageId:package,
          data: broadcast_data,
        }),
      },
      (response) => {
        console.log(actionId, "response", response)
      }
    )
}

module.exports = {
    broadcast: broadcast
}