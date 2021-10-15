import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
import { Button, Input, Spinner } from "reactstrap";
import elaboxLogo from './images/logo-circle-transparent.png'
import backend from "../api/backend";

function Config() {
  const [isConfiged, setConfiged] = useState(false);
  const [pwd1, setPwd1] = useState('qweqweqwe');
  const [pwd2, setPwd2] = useState('qweqweqwe');
  const [creating, setCreating] = useState(false)

  function createWallet() {
    //console.log(pwd1)
    //console.log(pwd2)
    setCreating(true)

    if (pwd1 === '' || pwd2 === '') {
      alert("You need to provide a password")
      setCreating(false)
    }
    else {
      if (pwd1.length < 8) {
        alert("Password has to be at least 8 characters long")
        setCreating(false)
      }
      else {
        if (pwd1 !== pwd2) {
          alert("Your passwords do not match!")
          setCreating(false)
        }
        else {
          backend.createWallet(pwd1)
            .then(responseJson => {

              setTimeout(() => {
                console.log(responseJson)
                // if success
                setCreating(false)
                // localStorage.setItem('isconfiged', responseJson.stdout.trim())
                localStorage.setItem('isconfiged', true)
                localStorage.setItem('islogedin', true)
                setConfiged(true);
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

  function handleChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (target.id === "pwd1") {
      setPwd1(value)
    }
    else {
      setPwd2(value)
    }

  }

  return (
    <div style={{ backgroundColor: '#272A3D', height: '100vh', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <center>
        <img src={elaboxLogo} style={{ width: '200px', height: '200px', paddingRight: '10px' }} alt="elabox-logo"/>

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
              <Input type="password" id="pwd1" name="pwd1" placeholder="Password" required onChange={(e) => handleChange(e)} style={{ marginTop: '30px' }} />
              <Input type="password" id="pwd2" name="pwd2" placeholder="Repeat password" required onChange={(e) => handleChange(e)} style={{ marginTop: '10px' }} />
              <Button type="submit" style={{ marginTop: '20px' }}>Create Wallet</Button>
            </form>

          </div>
        }

      </center>
    </div>
  );
}

export default Config;