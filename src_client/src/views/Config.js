import React, { useState, useRef } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Button, Input, Spinner, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import elaboxLogo from './images/logo-circle-transparent.png'
import backend from "../api/backend";
import Divider from '@mui/material/Divider';
import FileUploader from "./components/FileUploader"


function Config() {
  const [isConfiged, setConfiged] = useState(false);
  const [pwd1, setPwd1] = useState('qweqweqwe');
  const [pwd2, setPwd2] = useState('qweqweqwe');
  const [prevpwd, setPrevPwd] = useState('');
  const [newPwd1, setNewPwd1] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)

  const [creating, setCreating] = useState(false)
  const [importModal, setImportModal] = useState(false);
  const [isImported, setImported] = useState(false);
  const [status, setStatus] = useState(null);

  function closeModal() {
    setImportModal(false)
  }



  function uploadTemporaryFile() {
    const form = document.getElementById("myForm");
    const formData = new FormData(form);
    backend.importKeystoreTemporary(formData).then(response => {
        if (response.success) {
          console.log("Temporarily imported keypath file")
        } else {
            console.log("Unable to upload to temporary path")
        }

    })
  }

  function handleFile() {
    const form = document.getElementById("myForm");
    const formData = new FormData(form);
    backend.importKeystore(formData).then(response => {
        console.log("Upload status: ", response)
        if (response.success ) {
            setImported(true)
        } else {
            setStatus("Invalid keystore file.")
        }

    })
  }

  function changePassword() {
    backend.changeWalletPassword(newPwd1)

  }


  function verifyPassword() {
    console.log(newPwd1)
    console.log(newPwd2)
    uploadTemporaryFile()
    // if (newPwd1 == '' || newPwd2 == '' || prevpwd=='') {
    if (prevpwd=='') {
      alert("You need to provide a password")
      setCreating(false)
    } 
    else {
      // if (newPwd1.length < 8) {
      //   alert("New assword has to be at least 8 characters long")
      //   setCreating(false)
      // }
      // else {
        // if (newPwd1 != newPwd2) {
        //   alert("Your passwords do not match!")
        // } else if (prevpwd == newPwd2){
        //   alert("Your new password shouldn't match old password")
        // }
        // else {
          backend.verifyKeystorePwd(prevpwd)
            .then(responseJson => {
              if (responseJson.ok){
                alert("Successfully imported!")
                setIsPasswordVerified(true)
                localStorage.setItem('isconfiged', true)
                localStorage.setItem('islogedin', true)
                setConfiged(true);
              } else{
                alert("Invalid previous password!")
              }

            })
            .catch(error => {
              console.error(error);
              setCreating(false)

            });
      //   }
      // }
    }

  }


  function createWallet() {
    //console.log(pwd1)
    //console.log(pwd2)
    setCreating(true)

    if (pwd1 == '' || pwd2 == '') {
      alert("You need to provide a password")
      setCreating(false)
    }
    else {
      if (pwd1.length < 8) {
        alert("Password has to be at least 8 characters long")
        setCreating(false)
      }
      else {
        if (pwd1 != pwd2) {
          alert("Your passwords do not match!")
          setCreating(false)
        }
        else {
          backend.createWallet(pwd1)
            .then(responseJson => {

              setTimeout(() => {
                console.log(responseJson)
                setCreating(false)
              }, 3000)

            })
            .catch(error => {
              console.error(error);
            });
        }
      }
    }

  }

  if (isConfiged) {
    
    return <Redirect to="/download" />;
  }


  if (isPasswordVerified) {
    handleFile()
    localStorage.setItem('isconfiged', true)
    localStorage.setItem('islogedin', true)
    // changePassword()
    return <Redirect to="/companion" />;
  }

  function handleChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (target.id == "pwd1") {
      setPwd1(value)
    }
    else {
      setPwd2(value)
    }

  }

  

  function handlePasswordChange(event) {
    const { target } = event;
    const value = target.value;
    if (target.id == "prev-pwd") {
      setPrevPwd(value)
    } else if(target.id == "new-pwd") {
      setNewPwd1(value)
    }
    else {
      setNewPwd2(value)
    }

  }

  return (
    <div style={{ backgroundColor: '#272A3D', height: '100vh', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <center>
        <img src={elaboxLogo} style={{ width: '200px', height: '200px', paddingRight: '10px' }} />

        {creating
          ?
          <div style={{ paddingTop: '20px' }}>
            <Spinner type="grow" color="light" />
            <Spinner type="grow" color="light" />
            <Spinner type="grow" color="light" />
          </div>
          :
          <div style={{ paddingTop: '20px' }}>
            <h1 style={{ color: 'white' }}>Welcome to Elabox</h1>
            <h5 style={{ color: 'white' }}>Choose a secure password to protect your Elabox and wallet</h5>
            <form onSubmit={createWallet}>
              <Input data-testid="password-input" type="password" id="pwd1" name="pwd1" placeholder="Password" required onChange={(e) => handleChange(e)} style={{ marginTop: '30px' }} />
              <Input data-testid="password-confirm-input" type="password" id="pwd2" name="pwd2" placeholder="Repeat password" required onChange={(e) => handleChange(e)} style={{ marginTop: '10px' }} />
              <Button data-testid="create-wallet-submit-btn" type="submit" style={{ marginTop: '20px' }}>Create Wallet</Button>
            </form>

            <Divider variant="middle" style={{ color: 'white',  paddingTop: '20px' }} />

            <h2 style={{ color: 'white' }}>or</h2>

          <Modal isOpen={importModal}>
          <ModalHeader>Verify Password</ModalHeader>
          <ModalBody>
            <center>
              You are about to import an existing keystore.
              <br />
              Please set enter its password.
              <br />
              <br />

              <Input
              type="password"
              id="prev-pwd"
              name="prev-pwd"
              placeholder="Enter previous ELA wallet password"
              required
              onChange={(e) => handlePasswordChange(e)}
              />
              <br />
              <br />

              {/* <Input
              type="password"
              id="new-pwd"
              name="new-pwd"
              placeholder="Enter new ELA wallet password"
              required
              onChange={(e) => handlePasswordChange(e)}
              />
              <br />
              <br />
            <Input
              type="password"
              id="conf-pwd"
              name="conf-pwd"
              placeholder="Repeat new ELA wallet password"
              required
              onChange={(e) => handlePasswordChange(e)}
              /> */}

            </center>
          </ModalBody>
          <ModalFooter>
            <Button
              data-testid="restart-btn"
              color="success"
              onClick={verifyPassword}
            >
              Confirm
            </Button>
            <Button 
            color="danger" 
            onClick={closeModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>


          <FileUploader
          status={status}
          onImportedClick={setImportModal}
          onImport={handleFile}
          
          ></FileUploader>

          </div>



        }

      </center>
    </div>
  );
}

export default Config;