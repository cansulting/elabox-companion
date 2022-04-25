import React,{useState} from "react";

import { Button,  Modal,
    ModalBody,
    ModalFooter,
    ModalHeader ,Input} from "reactstrap"
import backend from "../api/backend"
import errorLogo from "../views/images/error.png";
import checkLogo from "../views/images/check.png";
const ResyncModal = ({isOpen,name,closeModal, node })=> {
    const [password , setPassword] = useState("")
    const [resyncSuccessModal,setResyncSuccessModal] = useState(false)
    const [errorModal,setErrorModal] = useState(false)
    const hamdleChangePassword = (event) => {
        const { target } = event;
        const { name } = target;
        setPassword(target.value)
      } 
      const verifyPassword = (action) => {
        // e.preventDefault();
        closeModal(false) 
        backend
        .authentication(password)
        .then((responseJson) => {
          if (responseJson.ok) {
            setResyncSuccessModal(true)
            resyncNode(password,name)
          }
          else{
            setErrorModal(true)
          }

        })        
    }
    const resyncNode = (pwd) => {
        // e.preventDefault();
        closeModal()    
        node
          .resync(pwd)
          .then((responseJson) => {
            node.fetchData();
          })
          .catch((error) => {
            console.error(error);
          });
      };    
      const errorToggle= () =>{
        setErrorModal(false)
      }
      const resyncSuccessToggle = ()=>{
        setResyncSuccessModal(false)
      }
    return  <>
            <Modal isOpen={errorModal} centered>
                <ModalHeader>Error</ModalHeader>
                <ModalBody>
                    <center>
                    Invalid password, please try again
                    <br />
                    <br />
                    <img src={errorLogo} style={{ width: "50px", height: "50px" }} />
                    </center>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={errorToggle}>
                    Close
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={resyncSuccessModal} centered>
                <ModalHeader>Success</ModalHeader>
                <ModalBody>
                    <center>
                    Resyncing Node <br />
                    <br />
                    <img src={checkLogo} style={{ width: "50px", height: "50px" }} />
                    </center>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={resyncSuccessToggle}>
                    Close
                    </Button>
                </ModalFooter>
            </Modal>            
            <Modal isOpen={isOpen} centered>
            <ModalHeader> Resync {name}</ModalHeader>
            <ModalBody>
            <center>
              Resycing the will take a few days.
              <br />
              You should try to restart the node first!
              <br />
              <br />
              Enter your wallet password to re-sync the {name}
              <br />
            </center>
            <Input
              type="password"
              id="pwd"
              name="pwd"
              placeholder="Enter ELA wallet password"
              required
              onChange={hamdleChangePassword}
            />
            </ModalBody>
            <ModalFooter>
            <Button
                data-testid="resync-btn"
                color="success"
                onClick={verifyPassword}              
            >
                Resync
            </Button>
            <Button color="danger" onClick={closeModal}>
                Cancel
            </Button>
            </ModalFooter>
            </Modal>      
    </>      
}

export default ResyncModal