import React, { useState } from "react"
import { Link, Redirect } from "react-router-dom"
import { Button, Input, Spinner } from "reactstrap"
import elaboxLogo from "./images/logo-circle-transparent.png"

import backend from "../api/backend"
import { useEffect } from "react/cjs/react.development"

function Login() {
  const [waitingTime,setWaitingTime]=useState(1)
  const [seconds,setTimer]=useState(window.localStorage.getItem("current_time")?.length>0 ?window.localStorage.getItem("current_time"):0)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [pwd, setPwd] = useState("")
  const [isProcessing, setProcessing] = useState(false)
  const isBlocked= seconds>0 
  useEffect(()=>{
    let interval=null
    if(seconds>0){
      interval=setInterval(()=>{
        setTimer(seconds=>seconds-1)
        window.localStorage.setItem("current_time",seconds)        
      },1000)
    }
    else{
      window.localStorage.removeItem("current_time")              
      clearInterval(interval)
    }
    return ()=>{
      clearInterval(interval)
    }
  },[seconds])
  function login() {
    setProcessing(true)
    backend
      .login(pwd)
      .then(async (response) => {
        const responseJson=await response.json()
        console.log("Login", responseJson)
        if (responseJson.ok) {
          localStorage.setItem("logedin", true)
          localStorage.setItem("address", responseJson.address)
          setLoggedIn(true)
        } else {
          if(responseJson.err!=="Too many auth request from this IP, please try again after 1 min"){
            alert("Wrong password")
          }
          else{
            setTimer(waitingTime)    
            if(waitingTime===1){
              setWaitingTime(5*60)                    
            }
            else if(waitingTime===5){
              setWaitingTime(15)                                  
            }
            else if(waitingTime===15){
              setWaitingTime(30)                                  
            }            
            else if(waitingTime===30){
              setWaitingTime(60)                                  
            }                        
            alert(`Too many auth request from this IP, please try again.`)            
          }
        }
        setProcessing(false)
      })
      .catch((error) => {
        console.error(error)
        setProcessing(false)
      })
  }

  if (isLoggedIn) {
    return <Redirect to="/" />
  }

  function handleChange(event) {
    const { target } = event
    const value = target.type === "checkbox" ? target.checked : target.value
    setPwd(value)
  }

  return (
    <div
      style={{
        backgroundColor: "#272A3D",
        height: "100vh",
        width: "100%",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <center>
        <img
          src={elaboxLogo}
          style={{ width: "200px", height: "200px", paddingRight: "10px" }}
        />
        <div style={{ paddingTop: "20px" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!isProcessing)
                login()
            }}
          >
            <Input
              data-testid="password"
              type="password"
              id="pwd"
              name="pwd"
              placeholder="********"
              required
              onChange={(e) => handleChange(e)}
              autoFocus
            />
            <Button data-testid="sign-in-btn" active={!isProcessing} type="submit" style={{ marginTop: "20px" }} disabled={isBlocked}>
              {!isProcessing && !isBlocked && "Sign In"} 
              {isBlocked && !isProcessing && `${new Date(seconds * 1000).toISOString().substr(11, 8)} remaning`}
              {isProcessing && <>Please wait<Spinner size='sm' style={{margin:"0 5px"}}/></>}
            </Button>
          </form>
        </div>
      </center>
    </div>
  )
}

export default Login
