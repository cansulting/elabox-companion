const config = require("../config")
const ElaboxFoundation = require("elabox-foundation")

const elaboxEvent = new ElaboxFoundation.EboxEvent(config.INSTALLER_SOCKET_URL)

// use to broadcast action to event server
async function broadcast(packageId, actionId, broadcast_data) {
    // broadcast_server.emit(
    //   config.ELA_SYSTEM,
    //   {
    //     id: config.ELA_SYSTEM_BROADCAST,
    //     data: JSON.stringify({
    //       id: actionId,
    //       packageId,
    //       data: broadcast_data,
    //     }),
    //   },
    //   (response) => {
    //     //syslog.write(syslog.create().debug(`Broadcast ${actionId} with response ${response}`).addCategory("event"))
    //   }
    // )

    elaboxEvent.broadcast(actionId, packageId, broadcast_data)
}


module.exports = {
    broadcast: broadcast,
    eboxEventInstance: elaboxEvent,
}