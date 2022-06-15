import React,{useState, useEffect} from "react"
import { Link } from "react-router-dom"
import * as Icon from "react-feather"
import { useMediaQuery } from "react-responsive"
import { Badge } from "reactstrap"

// import elaboxLogo from "./images/logo-wht.png";
import dashboardLogo from "../../images/dashboard_white.png"
import walletLogo from "../../images/wallet_white.png"
import settingsLogo from "../../images/settings_white.png"
import Activation from "../Activation"
import { ENABLE_ACTIVATION } from "../../../config"
import * as License from '../../../utils/license'

export default function SideBar({ updatesCount, isOpen, onClose }) {
  const [showActivation,setShowActivation]=useState(false)
  const [activated, setActivated]=useState(true)
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const handleShowActivation= () =>{
    setShowActivation(true)
  }
  const handleCloseActivation= (isActivated=false) =>{
    setShowActivation(false)
    setActivated(isActivated)
  }
  useEffect( () => {
    // check first if license is activated or not
    License.isActivated().then( _activated => {
      console.log("Device activated=", _activated)
      //_activated = false
      setActivated(_activated)
    })
  }, [isOpen])
  return (
    <div
      className="w3-sidebar w3-bar-block w3-animate-left"
      id="mySidebar"
      style={{
        ...{
          width: "18%",
          display: "block",
          backgroundColor: "#1E1E26",
          position:"relative"
        },
        ...(isMobile && { display: "none" }),
        ...(isMobile &&
          isOpen && {
          display: "block",
          zIndex: 1,
          width: "100%",
          backgroundColor: "rgb(0, 0, 0, 0.3)",
        }),
      }}
      onClick={isMobile ? onClose : undefined}
    >
      <Activation isOpen={showActivation} closeActivation={handleCloseActivation}/>      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "70%" : "90%",
          maxWidth: isMobile ? "400px" : undefined,
          height: "100%",
          backgroundColor: "#2C71F6",
          marginLeft: "10px",
          borderRadius: 10,
          color: "white",
        }}
      >
        <ul style={{ listStyle: "none", paddingTop: "20px", paddingLeft: "0" }}>
          <li>
            <div className="sidebarMenu">
              <Link
                to="/dashboard"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                {" "}
                <img
                  src={dashboardLogo}
                  style={{
                    widht: "30px",
                    height: "30px",
                    paddingRight: "10px",
                  }}
                />{" "}
                Dashboard
              </Link>
            </div>
          </li>
          <li>
            <div className="sidebarMenu">
              <Link
                to="/wallet"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                {" "}
                <img
                  src={walletLogo}
                  style={{
                    widht: "30px",
                    height: "30px",
                    paddingRight: "10px",
                  }}
                />
                Wallet
              </Link>
            </div>
          </li>
          <li>
            <div className="sidebarMenu">
              <Link
                to="/settings"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                {" "}
                <img
                  src={settingsLogo}
                  style={{
                    widht: "30px",
                    height: "30px",
                    paddingRight: "10px",
                  }}
                />
                Settings
              </Link>
            </div>
          </li>
          <li>
            <div className="sidebarMenu">
              <Link
                to="/updates"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                <span style={{ paddingRight: "10px" }}>
                  <Icon.Info height={30} width={30} />
                </span>
                Updates
                {updatesCount > 0 && (
                  <Badge color="danger" style={{ marginLeft: 8 }}>
                    {updatesCount}
                  </Badge>
                )}
              </Link>
            </div>
          </li>
          <li>
            <div className="sidebarMenu">
              <Link
                to="/help"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                <span style={{ paddingRight: "10px" }}>
                  <Icon.HelpCircle height={30} width={30} />
                </span>
                Help Center
              </Link>
            </div>
          </li>
        </ul>
      </div>
      {
      ENABLE_ACTIVATION && !activated &&
      <p 
        style={{color:"white",left:"27%", 
        position: "absolute", top: "80%", 
        cursor: "pointer" }} 
        onClick={handleShowActivation}>Activate Elabox</p>       
      }
    </div>
  )
}
