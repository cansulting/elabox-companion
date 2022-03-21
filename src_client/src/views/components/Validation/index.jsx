import React,{ useState,useEffect } from 'react'
import * as Icon from "react-feather"
export default function Validation({label, validation =()=>{},src}) {
  const [isValid,setIsValid]=useState(false)
  useEffect(()=>{
    if(Array.isArray(src)){
      setIsValid(validation())      
    }
    setIsValid(validation(src))
  },Array.isArray(src) ? src:[src])
  const icon = isValid ? <Icon.CheckCircle color="green"/>:<Icon.XCircle color="red"/>
  return (
    <p style={{fontSize:12}}>{icon} {label}</p>
  )
}
