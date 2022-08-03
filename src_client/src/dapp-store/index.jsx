import React, { useState ,useEffect} from "react"
import { useHistory } from "react-router-dom"
import RootStore from "../store"
import * as store from "elabox-dapp-store.lib"
import RestartModal from "./RestartModal"
import ResyncModal from "./ResyncModal"
import { EboxEventInstance } from "../config"

store.initialize(EboxEventInstance)
export default ({children}) => {  
    const { ela, eid, esc, feeds,carrier } = RootStore.blockchain    
    const [app,setApp] = useState({})
    const [restartModal,setRestartModal] = useState(false)
    const [resyncModal,setResyncModal] = useState(false)  
    const history = useHistory()  
    const onClick = (appInfo) => {
        const node = getNode(appInfo.id)
        const notification = updateStatus(appInfo, node)             
        const path = `/dashboard/${appInfo.id}`
        appInfo = {...appInfo,notificationContents:[notification]}
        setApp(appInfo)
        history.push(path)
    }    
    const onBack = ()=>{
        setApp({})
        history.push("/")         
    }
    const updateStatus = (appInfo, node)=>{
        let notification = {}
        if (appInfo.status === 'installed' && appInfo.enabled) {
            if (appInfo.isRunning === true && node.hasOwnProperty("servicesRunning")){
                if(node.servicesRunning){
                    notification={type:"info",content:"Syncing"}
                }      
                else {
                    notification={type:"info",content:"Initializing"}
                }                  
            }
            else {
                if(appInfo.isRunning === true) {
                    notification={type:"info",content:"Running"}
                }   
                else{
                    notification={type:"error",content:"Not running"}   
                }
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
                node = ela
                break;
            case "ela.eid":
                node = eid
                break;
            case "ela.esc":
                node = esc
                break;
            case "ela.feeds":
                node = feeds 
                break;
            case "ela.carrier":
                node = carrier             
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
    const updateNotifications = (appInfo) =>{
        const node = getNode(appInfo.id)
        const notification = updateStatus(appInfo, node)      
        appInfo = {...appInfo,notificationContents: [notification]}                       
        setApp(appInfo)                                                            
    }
    const handleAppStateChanged = appInfo => {
        updateNotifications(appInfo)
    }
    useEffect(()=>{
        const checkRoute = () => {
            const pathNameSplitCount = window.location.pathname.split("/").length
            const appId = window.location.pathname.split("/")[pathNameSplitCount - 1]  
            if(isValidApp(appId)){
                setApp({id:appId})
            }
        }       
        checkRoute()
    },[])    
    useEffect(()=>{
        const {pathname} = history.location
        if(pathname === "/dashboard" || pathname === "/"){
            setApp({})
        }
    },[history.location.pathname])
     const node = getNode(app.id)
     const hasSelectedApp = app.hasOwnProperty("id")
     return (
        <div style={{margin:10}}>
            <RestartModal name={app.name} node={app.id} isOpen={restartModal} closeModal={closeRestartModal}/>
            <ResyncModal name={app.name} node={app.id} isOpen={resyncModal} closeModal={closeResyncModal}/>
            {!hasSelectedApp ?
                <store.AppDashboardCon style={{backgroundColor:"#1E1E26",color:"white"}} iconWidth={130} iconHeight={130} onClick={onClick}/>
                :<store.AppInfoCon 
                    onRestart={onRestart} onResync={onResync} 
                    style={{color:"white"}} info={app} 
                    onBack={onBack} onAppStateChanged={handleAppStateChanged}>
                        {app.enabled && children(app, node)}
                </store.AppInfoCon>
            }
        </div>
    )
}