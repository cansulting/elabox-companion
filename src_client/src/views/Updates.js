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
  Alert
} from "reactstrap"
export default function Updates({ isMobile, ota }) {
  const {
    latestVersionDetails,
    hasNewUpdates,
    hasNewDownload,
    isProcessingData,
    isUpdated,
    notUpdated,
    isUpdating,
    isDownloading,
    progress,
    disabledButton,
    errmsg,
    clearErrMsg
  } = ota
  let body = ""
  let btnLabel = ""
  let headerLabel = ""
  const showNewDownload =
    hasNewDownload ||
    hasNewUpdates ||
    isDownloading ||
    isUpdating ||
    isUpdated ||
    notUpdated
  if (hasNewDownload) {
    body = (
      <div>
        <p>Name: {latestVersionDetails.name}</p>
        <p>Version: {latestVersionDetails.version}</p>
        <p>{latestVersionDetails.description}</p>
      </div>
    )
    headerLabel = "New Update available"
    btnLabel = "Download"
  } else if (isProcessingData) {
    body = (
      <Progress
        style={{ height: "50px" }}
        animated
        color="rgb(44, 113, 246)"
        value={progress.percent}
      >
        {/*progress.status*/}
      </Progress>
    )
    headerLabel = "Downloading Update " + ( "0" | progress.percent) + "%"
    btnLabel = <Spinner size="sm" color="light" children={""} />
  } else if (hasNewUpdates) {
    body = (
      <div>
        <p>Name: {latestVersionDetails.name}</p>
        <p>Version: {latestVersionDetails.version}</p>
        <p>{latestVersionDetails.description}</p>
      </div>
    )
    headerLabel = "New Update"
    btnLabel = "Install Now"
  }
  if (isUpdating) {
    body = (
      <div>
        <p>Name: {latestVersionDetails.name}</p>
        <p>Version: {latestVersionDetails.version}</p>
        <p>{latestVersionDetails.description}</p>
      </div>
    )
    headerLabel = "New Update"
    btnLabel = "Please Wait"
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
      <Alert color="info" color="danger" isOpen={errmsg !== null} toggle={ () => clearErrMsg()}>
        {errmsg}
      </Alert>
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
              {showNewDownload ? (
                <Row>
                  <Col>{body}</Col>
                  {!isProcessingData && (
                    <Col
                      className="d-flex justify-content-center flex-column"
                      xs="2"
                    >
                      <Button
                        color="success"
                        disabled={disabledButton}
                        onClick={() => {
                          if (hasNewDownload) {
                            ota.handleDownloadPackage()
                          } else if (hasNewUpdates) {
                            ota.handleUpdates()
                          }
                        }}
                        disabled={ota.disabledButton}
                      >
                        {btnLabel}
                      </Button>
                    </Col>
                  )}
                </Row>
              ) : (
                <h2 className="text-center">No updates</h2>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
