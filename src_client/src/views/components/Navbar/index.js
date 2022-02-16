import React, { useState,useEffect } from "react";
import { FiMenu, FiLogOut, FiPower, FiRefreshCcw } from "react-icons/fi";
import elaboxLogo from "../../images/logo-wht.png";
import { useMediaQuery } from "react-responsive";

import {
  Navbar as NavB,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";
import backend from "../../../api/backend";
const Navbar = ({ logOut, onMenuClick }) => {
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [currentSysOperation,setCurrentSysOperation]=useState("")
  const [modalProperties,setModalProperties]=useState({show:false,status:""})  
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const handleDropDownToggle = () => {
    setIsDropdownOpen(!isDropDownOpen);
  };
  useEffect(() => {
    const handleCheckElaboxStatus= () => {
      if(modalProperties.status==="Restarting..."){
        setInterval(async ()=>{
          const status = await backend.checkElaboxStatus()
          if(status){
            window.location.reload()
          }          
        },5000)
      }
    }
    handleCheckElaboxStatus()
  },[modalProperties.status==="Restarting..."])
  const handleRestart = () => {
    setModalProperties({show:true,status:"Restarting..."})    
    backend.restart()
  }
  const handleShutDown = () => {
    setModalProperties({show:true,status:"Shutting down..."})    
    backend.shutdown()
  }
  const handleSysOperation = operation=>{
    setCurrentSysOperation(operation)    
  }
  const handleHideCurrentSysOperationModal=()=>{
    setCurrentSysOperation("")
  }
  const handleSysOperationConfirmation=()=>{
    switch(currentSysOperation){
      case "reboot":
        handleHideCurrentSysOperationModal()        
        handleRestart()
        break;
      case "shut down":
        handleHideCurrentSysOperationModal()        
        handleShutDown()
        break;
      default:
        break;
    }
  }
  return (
    <>
      <NavB fixed="top" style={{ backgroundColor: "#1E1E26" }}>
        <Modal isOpen={modalProperties.show} centered dark>
          <ModalHeader>Elabox</ModalHeader>
          <ModalBody>
            Elabox is {modalProperties.status}
          </ModalBody>
        </Modal> 
        <Modal isOpen={currentSysOperation?.length>0} centered dark>
          <ModalHeader>Elabox</ModalHeader>
          <ModalBody>
            {currentSysOperation === "logout" ?<p>Are you sure you want to {currentSysOperation}?</p>:<p>Are you sure you want to {currentSysOperation} elabox?</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={handleHideCurrentSysOperationModal}>
              No
            </Button>                        
            <Button color="success" onClick={handleSysOperationConfirmation}>
              Yes
            </Button>
          </ModalFooter>          
        </Modal>         
        {isMobile && (
          <FiMenu
            color={"white"}
            size={"2em"}
            onClick={() => {
              onMenuClick((oldState) => !oldState);
            }}
          />
        )}
        <img
          className="align-middle"
          src={elaboxLogo}
          style={{ widht: "60px", height: "60px" }}
          alt={"Elabox Logo"}
        />
        <Dropdown isOpen={isDropDownOpen} toggle={handleDropDownToggle}>
          <DropdownToggle caret style={{ backgroundColor: "red" }}>
            <FiPower />
          </DropdownToggle>
          <DropdownMenu
            className="nar-dropdown"
            dark
            style={{
              textAlign: "left",
              backgroundColor: "rgb(39, 42, 61)",
            }}
          >
            <DropdownItem onClick={logOut}>
              <FiLogOut /> Log Out
            </DropdownItem>
            <DropdownItem onClick={()=>handleSysOperation("reboot")}>
              <FiRefreshCcw /> Reboot
            </DropdownItem>
            <DropdownItem onClick={()=>handleSysOperation("shut down")}>
              <FiPower /> Shut down
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* <Button onClick={logOut} color="danger">
          {isMobile ? <FiLogOut /> : "Log Out"}
        </Button> */}
      </NavB>
    </>
  );
};

export default Navbar;
