import React from "react"
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
  } = ota
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
      <Progress
        style={{ height: "50px" }}
        animated
        color="info"
        value={progress.percent}
      >
        {progress.status}
      </Progress>
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
      <Progress
        style={{ height: "50px" }}
        animated
        color="success"
        value={progress.percent}
      >
        {progress.status}
      </Progress>
    )
    headerLabel = "Update installed"
    btnLabel = "Ok"
  } else if (notUpdated) {
    body = (
      <Progress
        style={{ height: "50px" }}
        animated
        color="danger"
        value={progress.percent}
      >
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
                  <Col>{body}</Col>
                  {!isProcessingData && (
                    <Col
                      className="d-flex justify-content-center flex-column"
                      xs="1"
                    >
                      <Button
                        style={{ fontSize: 10 }}
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
                  )}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}
