import React, { useState, useEffect, useRef } from "react"
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Progress,
} from "reactstrap"
export default function Yes({
  show,
  isUpdating,
  isUpdated,
  notUpdated,
  hasNewUpdates,
  hasNewDownload,
  isDownloading,
  processUpdate,
  processDownloadPackage,
  resetStatus,
  latestVersionDetails,
}) {
  const [modal, setModal] = useState()
  const [progress, setProgress] = useState(0)
  const [installerLogs, setInstallerLogs] = useState("")
  const socket = window.socket
  const installerEndRef = useRef(null)
  useEffect(() => {
    setModal(show)
    setInstallerLogs("")
    setProgress(0)
  }, [show])
  useEffect(() => {
    if (!socket) return
    socket.on("installer_logs", (data) => {
      setInstallerLogs((prevInstallerLog) => `${prevInstallerLog} \n ${data}`)
    })
    socket.on("process_percent", (data) => {
      setProgress(data)
    })
  }, [socket])
  useEffect(() => {
    if(installerEndRef.current){
      installerEndRef.current.scrollIntoView()
    }
  }, [installerLogs])
  const toggle = () => {
    if (!isUpdating) {
      setModal(!modal)
    }
  }
  const handleOnClosed = () => {
    resetStatus()
  }
  let message = (
    <>
      <p>There is an update</p>
      <p>
        <span>Version:{latestVersionDetails?.version}</span>
        <br />
        <span>Build:{latestVersionDetails?.build}</span>
        <br />
        {latestVersionDetails?.description}
      </p>
    </>
  )
  if(hasNewDownload){
    message=<p>A firmware update is available for the Elabox!</p>
  }  
  let btnLabel = hasNewDownload ? "Download Now" :"Update Now";
  const showInstallerLogs =
    (isUpdating || isDownloading || isUpdated || notUpdated) && installerLogs.length > 0
  const showNoButton=hasNewUpdates || hasNewDownload;
  const isProcessingData=isUpdating || isDownloading
  if (isProcessingData) {
    message = (
      <Progress animated color="info" value={progress.percent}>
        {progress.status}
      </Progress>
    )
    btnLabel = <Spinner size="sm" color="light" children={""} />
  } else if (isUpdated) {
    message = (
      <Progress animated color="success" value={progress.percent}>
        {progress.status}
      </Progress>
    )
    btnLabel = "Ok"
  } else if (notUpdated) {
    message = (
      <Progress animated color="danger" value={progress.percent}>
        {progress.status}
      </Progress>
    )
    btnLabel = "Ok"
  }
  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      onClosed={handleOnClosed}
      backdrop={"static"}
      centered
    >
      <ModalHeader>Update Status</ModalHeader>
      <ModalBody>
        <div>
          {message}
          {showInstallerLogs && (
            <div
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
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        {showNoButton && (
          <Button color={"secondary"} onClick={toggle}>
            No
          </Button>
        )}
        <Button
          color={`${isProcessingData ? "dark" : "primary"}`}
          disabled={isProcessingData}
          onClick={() => {
            if (isUpdated || notUpdated) {
              toggle()
            } else {
              if(hasNewUpdates){
                processUpdate()
              }
              else if(hasNewDownload){
                processDownloadPackage()
              }
            }
          }}
        >
          {btnLabel}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

const AlwaysScrollToBottom = () => {
  const elementRef = useRef()
  useEffect(() => elementRef.current.scrollIntoView())
  return <div ref={elementRef} />
}
