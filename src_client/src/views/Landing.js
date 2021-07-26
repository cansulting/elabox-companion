import React, { useRef, useEffect } from "react"
import { Progress } from "reactstrap"
import ElaboxLogo from "./images/logo-circle-transparent.png"
export default function Landing({ ota }) {
  const installerEndRef = useRef(null)
  const { installerLogs, isProcessingData, progress } = ota
  useEffect(() => {
    if (installerEndRef.current) {
      installerEndRef.current.scrollIntoView()
    }
  }, [installerLogs])
  useEffect(() => {
    if (!isProcessingData) {
      window.location.reload()
    }
  }, [isProcessingData])
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E1E26",
      }}
    >
      <img src={ElaboxLogo} />
      <Progress
        style={{ height: "50px" }}
        animated
        color="info"
        value={progress.percent}
      >
        {progress.status}
      </Progress>
      {/* <div
        style={{
          marginTop: 10,
          padding: 10,
          maxHeight: 150,
          backgroundColor: "grey",
          overflow: "auto",
        }}
        ref={installerEndRef}
      >
        {installerLogs}
        <AlwaysScrollToBottom />
      </div> */}
    </div>
  )
}

const AlwaysScrollToBottom = () => {
  const elementRef = useRef()
  useEffect(() => elementRef.current.scrollIntoView())
  return <div ref={elementRef} />
}
