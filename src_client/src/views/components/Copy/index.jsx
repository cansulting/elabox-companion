import React,{useState} from "react"
import { Button,Tooltip } from "reactstrap"
import copy from "copy-to-clipboard";
import {AiFillCopy} from "react-icons/ai"
export default function Copy({id,label,data}) {
  const [isToolTipOpen,setIsToolTipOpen]=useState(false)  
  const handleCopy=()=>{
    setIsToolTipOpen(true)
    copy(data)
    setTimeout(()=>{
      setIsToolTipOpen(false)
    },2000)
  }  
  return (
      <>
          <Tooltip
            isOpen={isToolTipOpen}
            placement="top"
            target={id}
            trigger="click"
            >
              Copied
            </Tooltip>                  
            <p 
              style={{fontSize: 17,wordBreak:"break-word"}}>
              {label}: {data} 
              <Button id={id} color="success" 
              style={{marginLeft:3,padding:5,background:"transparent",border:"none"}} 
              size="sm" onClick={handleCopy}>
                <AiFillCopy/>
              </Button> 
            </p>            
      </>
  )
}
