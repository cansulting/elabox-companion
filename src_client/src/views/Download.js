import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from "reactstrap";
import elaboxLogo from './images/logo-circle-transparent.png'
import API from '../api/backend';
import Activation from "./components/Activation"
function Download() {
  const [downloading, setDownloading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showActivation,setShowActivation]=useState(true)
  function downloadWallet() {
    setDownloading(true);
    const pass=window.localStorage.getItem("pass")
    window.localStorage.removeItem("pass")
    API.downloadWallet(pass)
    .then(_ => {
      setTimeout(() => {
        // if success
        setFinished(true)
      }, 3000)
    })
    .catch( err => {
      alert(err)
      setDownloading(false)
    });
  }
  const handleCloseActivation= () =>{
    setShowActivation(false)
  }  
  return (
    <div style={{ backgroundColor: '#272A3D', height: '100vh', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <center>
        <img src={elaboxLogo} style={{ width: '200px', height: '200px', paddingRight: '10px' }} />
        {showActivation ? 
        <Activation isOpen={showActivation} closeActivation={handleCloseActivation} isModal={false}/>:
        <>
        {finished
          ?
          <div style={{ paddingTop: '20px' }}>
            <h1 style={{ color: 'white' }}>All set up</h1>
            <h3 style={{ color: 'white' }}>Enjoy your Elabox</h3>
            <Button style={{ marginTop: '20px' }}><Link to="/dashboard" style={{ textDecoration: 'none', color: 'white' }}> Dashboard</Link></Button>

          </div>
          :
          <div style={{ paddingTop: '20px' }}>
            <h1 style={{ color: 'white' }}>Wallet created</h1>
            <h5 style={{ color: 'white' }}>The only way to recover your wallet in case of any issue is to keep <br /> securely your <b>keytore.dat</b> file and the <b>password</b> you just created</h5>

            <Button disabled={downloading} onClick={downloadWallet} style={{ marginTop: '20px' }}> {downloading ? "Downloading..." : "Download keystore.dat"} </Button>
          </div>
        }        
        </> }
      </center>
    </div>
  );
}

export default Download;