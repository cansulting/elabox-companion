import { useState, useEffect } from "react"
import backend from "../api/backend"
import DIDAuth from "../utils/did"
import {validCharacters} from "../utils/auth"

const DidAuth = new DIDAuth()
DidAuth._initConnector()

export default function UseAuth(clearWindowAddress=false) {
    const [seconds,setTimer]=useState(0)    
    const [isProcessing, setProcessing] = useState(false)    
    const [isProcessingDid,setProcessingDid] = useState(false)
    const [isDIDAvailable, setDidAvailability] = useState(null)
    useEffect(() => {
      if ( isDIDAvailable === null) {
        DidAuth.isDidAvailable().then( available => setDidAvailability(available))
      }
    })
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
          reject("Password shouldnt contain special characters and space with atleast 6 characters.")
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
              console.log(responseJson)
              if(responseJson.err!=="Too many auth request from this IP"){
                reject("Wrong password")
              }
              else{
                backend.getRateLimitWaitTime().then(responseJson => {
                  setTimer(responseJson.rateLimitRemaining)
                })            
                reject(`Too many auth request from this IP, please try again.`)            
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
    const handleDidSignin = () =>{
      return new Promise( async (resolve,reject) => {
        try {
          setProcessingDid(true)            
          const authResult = await DidAuth.signin()
          if (authResult.code === 200) {
            const account = authResult.message
            localStorage.setItem('logedin', true)
            localStorage.setItem('address', account.wallet) 
            resolve(authResult)
          // not cancelled
          } else if (authResult.code !== 201) {
            reject(authResult.code + ":" + authResult.message)
          }
        } catch (error) {
          reject(error)
        }
        finally{
          setProcessingDid(false)
        }
      })
    }
  const isBlocked= seconds>0     
  const isdidavail = isDIDAvailable === null ? false : isDIDAvailable
  return {
    seconds,
    isBlocked,
    isProcessing,
    isProcessingDid,
    isDIDAvailable:isdidavail,
    handleLogin,
    handleDidSignin
  }
}
