import React, { useEffect } from "react"
import {useLocation} from "react-router-dom"
import {EboxEventInstance} from "../config"
import NodePreview from "./components/NodePreviewer"
import RootStore from "../store"
import { observer } from "mobx-react"
import Copy from "./components/Copy"
import DApps from "../dapp-store"

const Dashboard = ({ isMobile }) => {
  const { ela, eid, esc,feeds,carrier } = RootStore.blockchain
  const location = useLocation()
  useEffect(() => {
    if(location.pathname.includes('ela.mainchain')){
      EboxEventInstance.subscribe("ela.mainchain", res =>{
        console.log(res)
      })      
      EboxEventInstance.on("ela.mainchain.action.UPDATE", args => {
        const updatedEla = {...ela,...args.data}
        RootStore.blockchain.ela.update(updatedEla)
      })          
    }
    else if(location.pathname.includes("ela.esc")){
      EboxEventInstance.subscribe("ela.esc", res =>{
        console.log(res)
      })      
      EboxEventInstance.on("ela.esc.action.UPDATE", args => {
        const updatedEsc = {...esc,...args.data}
        //console.log(updatedEsc)
        RootStore.blockchain.esc.update(updatedEsc)
      })                
    }
    else{
      EboxEventInstance.off("ela.mainchain.action.UPDATE")
      EboxEventInstance.off("ela.esc.action.UPDATE")
    }
     return ()=>{
      EboxEventInstance.off("ela.mainchain.action.UPDATE")
      EboxEventInstance.off("ela.esc.action.UPDATE")      
    }
  }, [location.pathname])
  return (
    <div
      id="main"
      style={{
        ...{
          paddingLeft: "18%",
          width: "100%",
          backgroundColor: "#1E1E26",
        },
        ...(isMobile && { paddingLeft: undefined }),
      }}
      className="animated fadeIn w3-container"
    >
      <DApps services={{ela,eid,esc,feeds,carrier}}>
        {
          (app,node) => {
            let blockData = node;
            let MetaMask = <></>
            switch (app.id) {
              case "ela.esc":
                  MetaMask = <div style={{ marginTop: 20 }}>
                    <h4>Access details</h4>
                    <Copy id="Ip" label="IP" data={`http://${window.location.hostname}:${esc?.port}`}/>
                    <Copy id="ChainId" label="Chain ID" data={esc?.chainId}/>                                 
                  </div>     
                  break;
            }
            if(blockData !== "" && app.status === "installed"){
              return <>
                  <NodePreview blockdata={blockData} label="" />            
                  {MetaMask}                  
              </>
            }
            return 
          }
        }
      </DApps>
    </div>
  )
}

export default observer(Dashboard)
