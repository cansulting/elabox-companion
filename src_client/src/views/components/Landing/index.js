import React from 'react'
import ElaboxLandingLogo from "../../images/logo-landing.png"
export default function Landing({message = ""}) {
  return (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",width:"100vw",height:"100vh",backgroundColor:"rgb(39, 42, 61)"}}>
        <img src={ElaboxLandingLogo} width="200px"/>     
        {message?.length > 0 &&  <h3 style={{color:"white"}}>{message}</h3>}
    </div>
  )
}
