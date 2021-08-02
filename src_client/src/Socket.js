import { useState, useEffect } from "react"
import io from "socket.io-client"
const COMPANION_SOCKET_URL = window.location.hostname + ":3001"
const INSTALLER_SOCKET_URL = window.location.hostname + ":9000"
window.companion_socket = io(COMPANION_SOCKET_URL)
window.installer_socket = io(INSTALLER_SOCKET_URL, {
  transports: ["websocket"],
})
function Socket({ children }) {
  const [elaStatus, setElaStatus] = useState()
  const companion_socket = window.companion_socket
  const installer_socket = window.installer_socket
  const handleCheckStatus = () => {
    installer_socket.emit("elastatus", (currentStatus) => {
      if (currentStatus === "updating") {
        window.location.reload()
      }
      setElaStatus(currentStatus)
    })
  }
  useEffect(() => {
    if (!installer_socket) return
    installer_socket.on("connect", () => {
      handleCheckStatus()
      installer_socket.emit(
        "ela.system",
        { id: "ela.system.SUBSCRIBE", data: "ela.system" },
        (response) => {
          console.log(response)
        }
      )
    })
    installer_socket.on("disconnect", () => {
      console.log("installer server disconnected")
    })
  }, [installer_socket, elaStatus])
  useEffect(() => {
    if (!companion_socket) return
    companion_socket.on("connect", () => {
      console.log("companion server connected")
    })
    companion_socket.on("disconnect", () => {
      console.log("companion server disconnected")
    })
  }, [companion_socket])
  return children
}
export default Socket
