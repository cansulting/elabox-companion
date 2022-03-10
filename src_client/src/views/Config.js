import React, { useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Button, Input, Spinner } from "reactstrap";
import {validCharacters, 
  atleast6Characters, 
  doesNotContainsSpecialCharacters , 
  doesNotContainsSpace, 
  doesPasswordAndConfirmPasswordMatched} from "../utils/auth"
import Validation from "./components/Validation"
import elaboxLogo from './images/logo-circle-transparent.png'
import backend from "../api/backend";

function Config() {
  const [isConfiged, setConfiged] = useState(false);
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [creating, setCreating] = useState(false)

  function createWallet() {
    //console.log(pwd1)
    //console.log(pwd2)
    setCreating(true)

    if (pwd1 == '' || pwd2 == '') {
      alert("You need to provide a password")
      setCreating(false)
    }
    else {
      if(!validCharacters(pwd1)){
        alert("Password shouldnt contain special characters and space with atleast 6 characters.")
        setCreating(false)      
      }
      else {
        if (pwd1 != pwd2) {
          alert("Your passwords do not match!")
          setCreating(false)
        }
        else {
          backend.createWallet(pwd1)
            .then(response => {
              setTimeout(() => {
                console.log(response)
                // if success
                setCreating(false)
                if (response.ok === "ok" ) {
                  // localStorage.setItem('isconfiged', response.stdout.trim())
                  window.localStorage.setItem("pass",pwd1)                  
                  localStorage.setItem('isconfiged', true)
                  localStorage.setItem('islogedin', true)
                  setConfiged(true);
                } else {
                  alert(response.err)
                }
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
    if (target.id == "pwd1") {
      setPwd1(value)
    }
    else {
      setPwd2(value)
    }

  }

  return (
    <div style={{ backgroundColor: '#272A3D', height: '100vh', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <center>
        <img src={elaboxLogo} style={{ width: '180px', height: '180px', paddingRight: '10px' }} />

        {creating
          ?
          <div style={{ paddingTop: '20px' }}>
            <Spinner type="grow" color="light" />
            <Spinner type="grow" color="light" />
            <Spinner type="grow" color="light" />
          </div>
          :
          <div style={{ paddingTop: '5px' }}>
            <h1 style={{ color: 'white' }}>Welcome to Elabox</h1>
            <h5 style={{ color: 'white' }}>Choose a secure password to protect your Elabox and wallet</h5>
            <div style={{ color: 'white', padding:5, margin:5}}>
              <Validation label="Atleast 6 characters" validation={atleast6Characters} src={pwd1}/>
              <Validation label="Does not contains special characters" validation={doesNotContainsSpecialCharacters} src={pwd1}/>              
              <Validation label="Does not contains space" validation={doesNotContainsSpace} src={pwd1}/>                            
              <Validation label="Password and Confirm Password is the same" validation={()=>{
                return doesPasswordAndConfirmPasswordMatched(pwd1,pwd2)
              }} src={[pwd1,pwd2]}/>                            
            </div>            
            <form style={{marginTop:"-2em"}} onSubmit={createWallet}>
              <Input data-testid="password-input" type="password" id="pwd1" name="pwd1" placeholder="Password" required onChange={(e) => handleChange(e)} style={{ marginTop: '30px' }} />
              <Input data-testid="password-confirm-input" type="password" id="pwd2" name="pwd2" placeholder="Repeat password" required onChange={(e) => handleChange(e)} style={{ marginTop: '10px' }} />
              <Button data-testid="create-wallet-submit-btn" type="submit" style={{ marginTop: '20px' }}>Create Wallet</Button>
            </form>

          </div>
        }

      </center>
    </div>
  );
}

export default Config;