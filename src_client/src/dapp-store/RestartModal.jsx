import React,{useState} from "react";
import { restart } from 'elabox-dapp-store.lib/dist/actions'

import { Button,  Modal,
    ModalBody,
    ModalFooter,
    ModalHeader ,Input} from "reactstrap"
import backend from "../api/backend"
import errorLogo from "../views/images/error.png";
const RestartModal = ({isOpen,name,closeModal, node })=> {
    const [password , setPassword] = useState("")
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
            restartNode(password,name)
          }
          else{
            setErrorModal(true)
          }

        })        
    }
    const restartNode = (pwd) => {
        // e.preventDefault();
        closeModal()
        restart(node)
          .then((responseJson) => {
          })
          .catch((error) => {
            console.error(error);
          });
      };    
      const errorToggle= () =>{
        setErrorModal(false)
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
            <Modal isOpen={isOpen} centered>
            <ModalHeader> Restart {name}</ModalHeader>
            <ModalBody>
            <center>
                You are about to restart the {name}
                <br />
                This process will take a few hours
                <br />
                <br />              
                <Input
                type="password"
                id="pwd"
                name="pwd"
                placeholder="Enter wallet password"
                required
                onChange={hamdleChangePassword}
                />              
                <br />
                <br />              
            </center>
            </ModalBody>
            <ModalFooter>
            <Button
                data-testid="restart-btn"
                color="success"
                onClick={verifyPassword}              
            >
                Restart
            </Button>
            <Button color="danger" onClick={closeModal}>
                Cancel
            </Button>
            </ModalFooter>
            </Modal>      
    </>      
}

export default RestartModal