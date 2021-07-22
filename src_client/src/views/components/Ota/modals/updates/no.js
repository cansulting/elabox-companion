import React, { useState, useEffect } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
export default function No({ show, resetStatus }) {
  const [modal, setModal] = useState()
  useEffect(() => {
    setModal(show)
  }, [show])
  const toggle = () => {
    if (!modal === false) {
    }
    setModal(!modal)
  }
  const handleOnClosed = () => {
    resetStatus()
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
        <p>Your are already using the latest version</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          Ok
        </Button>
      </ModalFooter>
    </Modal>
  )
}
