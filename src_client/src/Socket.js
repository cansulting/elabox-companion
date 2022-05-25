import { useState, useEffect } from "react"
import { EboxEventInstance } from "./config";
let setup = false
let lastStatus = ""

// redirect to screen install when system initiates update
function Socket({ children }) {
  const [elaStatus, setElaStatus] = useState()
  const handleCheckStatus = () => {
    EboxEventInstance.getStatus((currentStatus) => {
      console.log("Status changed", currentStatus)
      if (currentStatus === lastStatus)
        return
      lastStatus = currentStatus
      if (currentStatus === "updating") {
        window.location.href = "/"
      }
      setElaStatus(currentStatus)
    }, true)
  }
  useEffect(() => {
    if (setup) return
    setup = true
    handleCheckStatus()
    EboxEventInstance.on("connect", () => {
      handleCheckStatus()
    })
  }, [elaStatus])
  return children
}
export default Socket
