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
    const onRestart= () =>{
        setRestartModal(true)
    }
    const onResync = () =>{
        setResyncModal(true)
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
            <ebox.AppDashboardCon style={{backgroundColor:"#1E1E26",color:"white"}} iconWidth={130} iconHeight={130} onClick={onClick}/>
            :<ebox.AppInfoCon onRestart={onRestart} onResync={onResync}  style={{color:"white"}} info={app} onBack={onBack}>
                {children(app)}
            </ebox.AppInfoCon>}
        </div>
    )
}