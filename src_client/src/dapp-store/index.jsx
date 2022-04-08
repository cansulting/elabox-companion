import React,{ useState } from "react"
import * as ebox from "elabox-dapp-store.lib"
import {EboxEvent} from "elabox-foundation"

ebox.initialize(new EboxEvent(window.location.hostname))
export default ({children}) => {  
    const [app,setApp] = useState({})
    const onClick = (app) => {
        console.log(app)
        setApp(app)
    }    
    const onBack = ()=>{
        setApp({})
    }
    const hasSelectedApp = app.hasOwnProperty("id")
    return (
        <div style={{margin:10}}>
            {!hasSelectedApp ?
            <ebox.AppDashboardCon onClick={onClick}/>
            :<ebox.AppInfoCon info={app} onBack={onBack}>
                {children(app)}
            </ebox.AppInfoCon>}
        </div>
    )
}