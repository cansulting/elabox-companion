import React, { useState } from "react"
import { Link, Redirect } from "react-router-dom"
import { Button, Input, Spinner } from "reactstrap"
import elaboxLogo from "./images/logo-circle-transparent.png"

import backend from "../api/backend"

function Login() {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [pwd, setPwd] = useState("")
  const [isProcessing, setProcessing] = useState(false)

  function login() {
    setProcessing(true)
    backend
      .login(pwd)
      .then((responseJson) => {
        console.log("Login", responseJson)
        if (responseJson.ok) {
          localStorage.setItem("logedin", true)
          localStorage.setItem("address", responseJson.address)
          setLoggedIn(true)
        } else {
          alert("Wrong password")
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
            <Button data-testid="sign-in-btn" active={!isProcessing} type="submit" style={{ marginTop: "20px" }}>
              {!isProcessing && "Sign In"} 
              {isProcessing && <>Please wait<Spinner size='sm' style={{margin:"0 5px"}}/></>}
            </Button>
          </form>
        </div>
      </center>
    </div>
  )
}

export default Login
