import React, { useEffect } from "react"
import { Progress } from "reactstrap"
import ElaboxLogo from "./images/logo-circle-transparent.png"
export default function Landing({ ota }) {
  const { isUpdated, progress } = ota
  useEffect(() => {
    if (isUpdated) {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }, [isUpdated])
  return (
    <div
      style={{
        height: "100vh",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E1E26",
      }}
    >
      <img src={ElaboxLogo} />
      <Progress
        style={{ height: "50px", margin: 10, width: "100%" }}
        animated
        color="info"
        value={progress.percent}
      >
        {progress.status}
      </Progress>
    </div>
  )
}
