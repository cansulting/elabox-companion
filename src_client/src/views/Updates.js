import React,  { useState }  from "react"
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter 
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
    clearErrMsg,
    warningShown,
    showWarning,
  } = ota
  let body = ""
  let btnLabel = ""
  let headerLabel = ""
  // Warning label can be changed
  let warningLabel = "This will update Elabox client and system to the latest version. You may download a backup of your wallet in order to ensure that your data is safe in case of an interuption happening during the update which may cause some issues on the system."
  const showNewDownload =
    hasNewDownload ||
    hasNewUpdates ||
    isDownloading ||
    isUpdating ||
    isUpdated ||
    notUpdated

  const [modal, setWarningModal] = useState(false);
  const toggleWarningModal = () => setWarningModal(!modal);

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
        data-testid="update-progress"
        style={{ height: "50px" }}
        animated
        color="rgb(44, 113, 246)"
        value={progress.percent}
      >
        {/*progress.status*/}
      </Progress>
    )
    headerLabel = "Downloading Update " + ("0" | progress.percent) + "%"
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
      <Alert color="info" color="danger" isOpen={errmsg !== null} toggle={() => clearErrMsg()}>
        {errmsg}
      </Alert>

      
      <Modal isOpen={modal} toggle={toggleWarningModal} className="warningModal">
        <ModalHeader toggle={() => toggleWarningModal()} >Warning</ModalHeader>
        <ModalBody>

          {warningLabel}

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick=
            {() => 
              {showWarning(); toggleWarningModal(); ota.handleUpdates()              }
            }>Continue</Button>{' '}
          <Button color="secondary" onClick={toggleWarningModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

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
                        data-testid="download-btn"
                        color="success"
                        disabled={disabledButton}
                        onClick={() => {
                          if (hasNewDownload) {
                            ota.handleDownloadPackage()
                          } else if (hasNewUpdates) {
                            if (!warningShown){
                              toggleWarningModal()
                            } 
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
