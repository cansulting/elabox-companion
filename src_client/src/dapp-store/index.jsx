import React, { useState } from "react"
import * as ebox from "elabox-dapp-store.lib"
import {EboxEvent} from "elabox-foundation"
import RestartModal from "./RestartModal"
import ResyncModal from "./ResyncModal"
ebox.initialize(new EboxEvent(window.location.hostname))
export default ({services,children}) => {  
    const [app,setApp] = useState({})
    const [restartModal,setRestartModal] = useState(false)
    const [resyncModal,setResyncModal] = useState(false)    
    const onClick = (app) => {
        const node = getNode(app.id)
        const notification = updateStatus(node)                
        setApp({...app,notificationContents:[notification]})
    }    
    const onBack = ()=>{
        setApp({})
    }
    const updateStatus = (node)=>{
        let notification = {}
        if (node.hasOwnProperty("isRunning") && node.hasOwnProperty("servicesRunning")){
            if(node.isRunning){
                if(node.servicesRunning){
                    notification={type:"info",content:"Syncing"}
                }      
                else if(!node.servicesRunning){
                    notification={type:"info",content:"Initializing"}
                }                              
            }
            else{
                notification={type:"error",content:"Not running"}   
            }                    
        }
        else if(node.hasOwnProperty("isRunning") ){
            if(node.isRunning){
                notification={type:"info",content:"Running"}
            }   
            else{
                notification={type:"error",content:"Not running"}   
            }
        }
        return notification
    }
    const customActions=()=>{
        const actions = []
        const isService = app.id==="ela.mainchain" || app.id ==="ela.eid" || app.id === "ela.esc" || app.id === "ela.carrier" || app.id === "ela.feeds"
        if(isService){
            actions.push({label:"Restart",color:"red",onClick:()=>{
                setRestartModal(true)
            }})
            if(app.id !== "ela.feeds" || app.id !== "ela.carrier"){
                actions.push({label:"Resync",color:"red",onClick:()=>{
                    setResyncModal(true)
                }})
            }
        }
        return actions
    }
    const closeRestartModal = () =>{
        setRestartModal(false)
    }
    const closeResyncModal = () =>{
        setResyncModal(false)
    }
    const getNode = (appId)=>{
        let node = {};
        switch (appId) {
            case "ela.mainchain":
                node = services.ela
                break;
            case "ela.eid":
                node = services.eid
                break;
            case "ela.esc":
                node = services.esc
                break;
            case "ela.feeds":
                node = services.feeds 
                break;
            case "ela.carrier":
                node = services.carrier             
                break;
            default:
                node  = {}
        }
        return node;
    }
     const node = getNode(app.id)
     const hasSelectedApp = app.hasOwnProperty("id")
     return (
        <div style={{margin:10}}>
            <RestartModal name={app.name} node={node} isOpen={restartModal} closeModal={closeRestartModal}/>
            <ResyncModal name={app.name} node={node} isOpen={resyncModal} closeModal={closeResyncModal}/>
            {!hasSelectedApp ?
            <ebox.AppDashboardCon style={{backgroundColor:"#1E1E26",color:"white"}} onClick={onClick}/>
            :<ebox.AppInfoCon customActions={customActions()} style={{color:"white"}} info={app} onBack={onBack}>
                {children(app.id,node)}
            </ebox.AppInfoCon>}
        </div>
    )
}