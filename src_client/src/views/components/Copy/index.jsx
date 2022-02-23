import React,{useState} from "react"
import { Button,Tooltip } from "reactstrap"
import copy from "copy-to-clipboard";
import {AiFillCopy} from "react-icons/ai"
export default function Copy({id,label,data}) {
  const [isToolTipOpen,setIsToolTipOpen]=useState(false)    
  return (
      <>
          <Tooltip
            autohide
            isOpen={isToolTipOpen}
            placement="right"
            target={id}
            trigger="click"
            >
              Copied
            </Tooltip>                  
            <p style={{fontSize: 17}} onMouseLeave={()=>{
                setIsToolTipOpen(false)
            }}>{label}: {data} <Button id={id} color="success" style={{marginLeft:3,padding:5,background:"transparent",border:"none"}} size="sm" onClick={()=>{
                setIsToolTipOpen(true)
                copy(data)
            }}><AiFillCopy/></Button> 
      </p>            
      </>
  )
}
