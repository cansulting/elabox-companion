import { useState, useEffect,useRef } from "react"
import backend from "../api/backend"
import {validCharacters} from "../utils/auth"
export default function UseAuth(clearWindowAddress=false) {
    const [seconds,setTimer]=useState(0)    
    const [isProcessing, setProcessing] = useState(false)    
    useEffect(()=>{
      if(clearWindowAddress){
        window.localStorage.removeItem('address');    
      }

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
    const handleLogin= async pwd => {
      return new Promise((resolve,reject)=>{
        setProcessing(true)
        if(!validCharacters(pwd)){
          resolve("Password shouldnt contain special characters and space with atleast 6 characters.")
          setProcessing(false)      
          return;
        }
          backend
          .login(pwd)
          .then(async (response) => {
            const responseJson=await response.json()
            if (responseJson.ok) {
              localStorage.setItem('logedin', true);
              localStorage.setItem('address', responseJson.address);
              resolve("")
            } else {
              if(responseJson.err!=="Too many auth request from this IP"){
                resolve("Wrong password")
              }
              else{
                backend.getRateLimitWaitTime().then(responseJson => {
                  setTimer(responseJson.rateLimitRemaining)
                })            
                resolve(`Too many auth request from this IP, please try again.`)            
              }
            }
          })
          .catch((error) => {
            console.error(error)
            reject(error)
          })
          .finally(()=>{
            setProcessing(false)                
          })   
      }) 
    }    
    const isBlocked= seconds>0     
  return {
    seconds,
    isBlocked,
    isProcessing,
    handleLogin,
  }
}
