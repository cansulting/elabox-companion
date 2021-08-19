import { useState, useEffect } from "react"
import io from "socket.io-client"
const BROADCAST_SERVER_URL = window.location.hostname
export const SERVICE_ID = "ela.system"
export const event_server = io(BROADCAST_SERVER_URL, {
  transports: ["websocket"],
})
function Socket({ children }) {
  const [elaStatus, setElaStatus] = useState()
  const handleCheckStatus = () => {
    event_server.emit("elastatus", (currentStatus) => {
      console.log("Status changed", currentStatus)
      if (currentStatus === "updating") {
        window.location.href = "/"
      }
      setElaStatus(currentStatus)
    })
  }
  useEffect(() => {
    if (!event_server) return
    event_server.on("ela.broadcast.SYSTEM_STATUS_CHANGED", (data) => {
      console.log("Status changed", data)
    })
    event_server.on("connect", () => {
      handleCheckStatus()
      event_server.emit(
        "ela.system",
        { id: "ela.system.SUBSCRIBE"},
        (response) => {
          console.log(response)
        }
      )
      event_server.emit(
        "ela.system",
        { id: "ela.system.SUBSCRIBE", data: "ela.installer" },
        (response) => {
          console.log(response)
        }
      )
    })
    event_server.on("disconnect", () => {
      console.log("broadcast server disconnected")
    })
    event_server.on("connect_error", (response) => {
      console.log(response)
    })
  }, [event_server, elaStatus])
  return children
}
export default Socket
