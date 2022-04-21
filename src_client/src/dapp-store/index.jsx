import React, { useState } from "react"
import * as ebox from "elabox-dapp-store.lib"
import {EboxEvent} from "elabox-foundation"
import RestartModal from "./RestartModal"
import ResyncModal from "./ResyncModal"
import RootStore from "../store";
ebox.initialize(new EboxEvent(window.location.hostname))
export default ({children}) => {  
    const [app,setApp] = useState({})
    const [restartModal,setRestartModal] = useState(false)
    const [resyncModal,setResyncModal] = useState(false)    
    const onClick = (app) => {
        setApp(app)
    }    
    const onBack = ()=>{
        setApp({})
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
    const getNode = ()=>{
        let node={}
        switch (app.id) {
            case "ela.mainchain":
                node = RootStore.blockchain.ela
                break;
            case "ela.eid":
                node = RootStore.blockchain.eid
                break;
            case "ela.esc":
                node = RootStore.blockchain.esc
                break;
            case "ela.feeds":
                node = RootStore.blockchain.feeds 
            case "ela.carrier":
                node = RootStore.blockchain.carrier             
            default:
                node  = {}
                break;
        }
        return node;
    }
     const node = getNode()
     const hasSelectedApp = app.hasOwnProperty("id")
     return (
        <div style={{margin:10}}>
            <RestartModal name={app.name} node={node} isOpen={restartModal} closeModal={closeRestartModal}/>
            <ResyncModal name={app.name} node={node} isOpen={resyncModal} closeModal={closeResyncModal}/>
            {!hasSelectedApp ?
            <ebox.AppDashboardCon style={{backgroundColor:"#1E1E26",color:"white"}} iconWidth={200} iconHeight={200} onClick={onClick}/>
            :<ebox.AppInfoCon customActions={customActions()} style={{color:"white"}} info={app} onBack={onBack}>
                {children(app)}
            </ebox.AppInfoCon>}
        </div>
    )
}