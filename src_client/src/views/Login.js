import React, { useState, useEffect ,useRef} from "react"
import { Link, Redirect } from "react-router-dom"
import { Button, Input, Spinner } from "reactstrap"
import {validCharacters} from "../utils/auth"
import elaboxLogo from "./images/logo-circle-transparent.png"

import backend from "../api/backend"

function Login() {
  const [seconds,setTimer]=useState(0)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [pwd, setPwd] = useState("")
  const [isProcessing, setProcessing] = useState(false)
  const inputPasswordRef=useRef(null)
  const isBlocked= seconds>0 
  useEffect(()=>{
    window.localStorage.removeItem("pass")    
    window.localStorage.removeItem('address');    
    backend.getRateLimitWaitTime().then(responseJson => {
      setTimer(responseJson.rateLimitRemaining)
    })
  },[])
  useEffect(()=>{
    let interval=null
    if(seconds>0){
      interval=setInterval(()=>{
        setTimer(seconds=>seconds-1)
      },1000)
    }
    else{
      backend.getRateLimitWaitTime().then(responseJson => {
        setTimer(responseJson.rateLimitRemaining)
      })      
      clearInterval(interval)
    }
    return ()=>{
      clearInterval(interval)
    }
  },[seconds])
  function login() {
    setProcessing(true)
    if(!validCharacters(pwd)){
      alert("Password shouldnt contain special characters and space with atleast 6 characters.")
      setProcessing(false)      
      return;
    }
    backend
      .login(pwd)
      .then(async (response) => {
        const responseJson=await response.json()
        console.log("Login", responseJson)
        if (responseJson.ok) {
          localStorage.setItem('logedin', true);
          localStorage.setItem('address', responseJson.address);
          setLoggedIn(true);
        } else {
          inputPasswordRef.current.value=""
          if(responseJson.err!=="Too many auth request from this IP"){
            alert("Wrong password")
          }
          else{
            backend.getRateLimitWaitTime().then(responseJson => {
              setTimer(responseJson.rateLimitRemaining)
            })            
            alert(`Too many auth request from this IP, please try again.`)            
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(()=>{
        setProcessing(false)                
      })
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  function handleChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setPwd(value);
  }

  return (
    <div
      style={{
        backgroundColor: '#272A3D',
        height: '100vh',
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <center>
        <img
          src={elaboxLogo}
          style={{ width: '200px', height: '200px', paddingRight: '10px' }}
        />
        <div style={{ paddingTop: '20px' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isProcessing) login();
            }}
          >
            <Input
              data-testid="password"
              type="password"
              id="pwd"
              name="pwd"
              placeholder="********"
              required
              innerRef={inputPasswordRef}              
              onChange={(e) => handleChange(e)}
              autoFocus
            />
            <Button data-testid="sign-in-btn" active={!isProcessing} type="submit" style={{ marginTop: "20px" }} disabled={isBlocked}>
              {!isProcessing && !isBlocked && "Sign In"} 
              {isBlocked && !isProcessing && `${new Date(seconds * 1000).toISOString().substr(11, 8)} remaning`}
              {isProcessing && <>Please wait<Spinner size='sm' style={{margin:"0 5px"}}/></>}
            </Button>
          </form>
          <a style={{position:"absolute", bottom: 20,right: 30,color: "white"}} href="https://elabox.com/contact" target="_blank" rel="noopener noreferrer nofollow">
          Contact Us
          </a>
        </div>
      </center>
    </div>
  );
}

export default Login;
