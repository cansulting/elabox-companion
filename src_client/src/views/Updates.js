import React, { useState, useEffect, useRef } from "react"
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
  Spinner,
} from "reactstrap"
export default function Updates({ isMobile, ota }) {
  const installerEndRef = useRef(null)
  const {
    currentVersionDetails,
    latestVersionDetails,
    hasNewUpdates,
    hasNewDownload,
    isProcessingData,
    isUpdated,
    notUpdated,
    isUpdating,
    isDownloading,
    progress,
    installerLogs,
  } = ota
  const showInstallerLogs =
    (isUpdating || isDownloading || isUpdated || notUpdated) &&
    installerLogs.length > 0
  useEffect(() => {
    if (installerEndRef.current) {
      installerEndRef.current.scrollIntoView()
    }
  }, [installerLogs])
  let body = ""
  let btnLabel = ""
  let headerLabel = ""
  if (hasNewDownload) {
    body = (
      <div>
        <p>Name: {latestVersionDetails.name}</p>
        <p>Version: {latestVersionDetails.version}</p>
        <p>{latestVersionDetails.description}</p>
      </div>
    )
    headerLabel = "New download"
    btnLabel = "Download"
  } else if (isProcessingData) {
    body = (
      <>
        <Progress
          animated
          color="info"
          value={progress.percent}
          style={{ height: 20 }}
        >
          {progress.status}
        </Progress>
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
      </>
    )
    headerLabel = "Processing...."
    btnLabel = <Spinner size="sm" color="light" children={""} />
  } else if (hasNewUpdates) {
    body = (
      <div>
        <p>Name: {latestVersionDetails.name}</p>
        <p>Version: {latestVersionDetails.version}</p>
        <p>{latestVersionDetails.description}</p>
      </div>
    )
    headerLabel = "New update"
    btnLabel = "Update"
  } else if (isUpdated) {
    body = (
      <Progress animated color="success" value={progress.percent}>
        {progress.status}
      </Progress>
    )
    headerLabel = "Update installed"
    btnLabel = "Ok"
  } else if (notUpdated) {
    body = (
      <Progress animated color="danger" value={progress.percent}>
        {progress.status}
      </Progress>
    )
    headerLabel = "Not updated"
    btnLabel = "Ok"
  }
  return (
    <div
      style={{
        ...{
          paddingLeft: "18%",
          width: "100%",
          backgroundColor: "#1E1E26",
        },
        ...(isMobile && { paddingLeft: undefined }),
      }}
      className="animated fadeIn w3-container"
    >
      <Row>
        <Col>
          <Card
            style={{
              backgroundColor: "#272A3D",
              color: "white",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          >
            <CardHeader>Installed Version</CardHeader>
            <CardBody>
              <p>Name: {currentVersionDetails.name}</p>
              <p>Version: {currentVersionDetails.version}</p>
              <p>{currentVersionDetails.description}</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {(hasNewDownload ||
        hasNewUpdates ||
        isDownloading ||
        isUpdating ||
        isUpdated ||
        notUpdated) && (
        <Row>
          <Col>
            <Card
              style={{
                backgroundColor: "#272A3D",
                color: "white",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            >
              <CardHeader>{headerLabel}</CardHeader>
              <CardBody>
                <Row>
                  <Col lg="12">{body}</Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Col lg="12">
                    <Button
                      className="float-right"
                      color="success"
                      onClick={() => {
                        if (hasNewDownload) {
                          ota.handleDownloadPackage()
                        } else if (hasNewUpdates) {
                          ota.handleUpdates()
                        } else if (isUpdated) {
                          window.location.reload()
                        }
                      }}
                      disabled={ota.disabledButton}
                    >
                      {btnLabel}
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}

const AlwaysScrollToBottom = () => {
  const elementRef = useRef()
  useEffect(() => elementRef.current.scrollIntoView())
  return <div ref={elementRef} />
}
