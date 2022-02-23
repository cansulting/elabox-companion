import React, { useState ,useRef} from "react"
import { Redirect } from "react-router-dom"
import { Button, Input, Spinner } from "reactstrap"
import useAuth from "../hooks/UseAuth"
import elaboxLogo from "./images/logo-circle-transparent.png"

const CLEAR_WINDOW_ADDRESS = true
function Login() {
  const [pwd,setPwd]=useState("")
  const [isLoggedIn, setLoggedIn] = useState(false)  
  const {seconds,isBlocked,isProcessing, handleLogin } = useAuth(CLEAR_WINDOW_ADDRESS)
  function login() {
    handleLogin(pwd).then(_=>{
      setLoggedIn(true)
    }).catch(err=>{
      setPwd("")
      alert(err)
    })
  }
  function handleChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setPwd(value);
  }
  if (isLoggedIn) {
    return <Redirect to="/" />;
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
              value={pwd}
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
