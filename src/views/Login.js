import React, {useState} from "react";
import { Link, Redirect} from 'react-router-dom';
import {Button, Input } from "reactstrap";
import elaboxLogo from './images/logo-circle-transparent.png'




function Login() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [pwd, setPwd] = useState('');

    function login(){

      fetch('http://elabox.local:3001/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pwd,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.ok){
            localStorage.setItem('logedin', true)
            localStorage.setItem('address', responseJson.address)
            setLoggedIn(true);
          }
          else {
            alert("Wrong password")
          }
        })
        .catch(error => {
          console.error(error);
        });
    }

    if (isLoggedIn) {
      return <Redirect to="/" />;
    }

    function handleChange(event){
      const { target } = event;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      setPwd(value)
    }

  return (
    <div style={{backgroundColor:'#272A3D', height:'100vh', width:'100%',  justifyContent:'center', display:'flex', alignItems:'center'}}>
      <center>
        <img src={elaboxLogo} style={{width:'200px', height:'200px', paddingRight: '10px'}} />
        <div style={{paddingTop: '20px'}}>
          <Input type="password" id="pwd" name="pwd" placeholder="********" required onChange={ (e) => handleChange(e) } />
          <Button onClick={login} style={{marginTop: '20px'}}>Sign_In</Button>
        </div>
      </center>
    </div>
  );
}

export default Login;