import React, { useState ,useEffect} from "react"
import { useHistory } from "react-router-dom"
import * as ebox from "elabox-dapp-store.lib"
import {EboxEvent} from "elabox-foundation"
import RestartModal from "./RestartModal"
import ResyncModal from "./ResyncModal"
ebox.initialize(new EboxEvent(window.location.hostname))
export default ({services,children}) => { 
    const history = useHistory() 
    const [app,setApp] = useState({})
    const [restartModal,setRestartModal] = useState(false)
    const [resyncModal,setResyncModal] = useState(false)    
    const onClick = (app) => {
        const node = getNode(app.id)
        const notification = updateStatus(node)             
        const path = `/dashboard/${app.id}`
        const appInfo = {...app,notificationContents:[notification]}
        setApp(appInfo)
        history.push(path)
    }    
    const onBack = ()=>{
        setApp({})
        history.push("/")       
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
    const getNode = appId =>{
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
    const isValidApp = appId =>{
        let isValid = false
        switch (appId) {
            case "ela.mainchain":
            case "ela.eid":
            case "ela.esc":
            case "ela.feeds":
            case "ela.carrier":
            case "trinity.pasar":
            case "glide":
                isValid = true 
                break
            default:
                isValid = false
        }        
        return isValid
    }
    useEffect(()=>{
        const checkRoute = () => {
            const pathNameSplitCount = window.location.pathname.split("/").length
            const appId = window.location.pathname.split("/")[pathNameSplitCount - 1]  
            if(isValidApp(appId)){
                const node = getNode(appId)
                const notification = updateStatus(node)      
                const appInfo = {id: appId, notificationContents: [notification]}                       
                setApp(appInfo)
            }
        }       
        checkRoute()
    },[])    
     const node = getNode(app.id)
     const hasSelectedApp = app.hasOwnProperty("id")
     return (
        <div style={{margin:10}}>
            <RestartModal name={app.name} node={app.id} isOpen={restartModal} closeModal={closeRestartModal}/>
            <ResyncModal name={app.name} node={app.id} isOpen={resyncModal} closeModal={closeResyncModal}/>
            {!hasSelectedApp ?
            <ebox.AppDashboardCon style={{backgroundColor:"#1E1E26",color:"white"}} iconWidth={130} iconHeight={130} onClick={onClick}/>
            :<ebox.AppInfoCon onRestart={onRestart} onResync={onResync}  style={{color:"white"}} info={app} onBack={onBack}>
                {children(app.id, node)}
            </ebox.AppInfoCon>}
        </div>
    )
}