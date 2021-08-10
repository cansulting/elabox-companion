import { useState, useEffect } from "react"
import io from "socket.io-client"
const BROADCAST_SERVER_URL = window.location.hostname + ":9000"
export const SERVICE_ID = "ela.system"
export const broadcast_server = io(BROADCAST_SERVER_URL, {
  transports: ["websocket"],
})
function Socket({ children }) {
  const [elaStatus, setElaStatus] = useState()
  const handleCheckStatus = () => {
    broadcast_server.emit("elastatus", (currentStatus) => {
      if (currentStatus === "updating") {
        window.location.href = "/"
      }
      setElaStatus(currentStatus)
    })
  }
  useEffect(() => {
    if (!broadcast_server) return
    broadcast_server.emit(
      "ela.system",
      { id: "ela.system.SUBSCRIBE", data: "ela.system" },
      (response) => {
        console.log(response)
      }
    )
    broadcast_server.emit(
      "ela.system",
      { id: "ela.system.SUBSCRIBE", data: "ela.installer" },
      (response) => {
        console.log(response)
      }
    )
    broadcast_server.on("connect", () => {
      handleCheckStatus()
    })
    broadcast_server.on("disconnect", () => {
      console.log("broadcast server disconnected")
    })
    broadcast_server.on("connect_error", (response) => {
      console.log(response)
    })
  }, [broadcast_server, elaStatus])
  return children
}
export default Socket
