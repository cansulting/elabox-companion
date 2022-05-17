import React, { useEffect } from "react"
import {useLocation} from "react-router-dom"
import {EboxEvent} from "elabox-foundation"
import NodePreview from "./components/NodePreviewer"
import RootStore from "../store"
import { observer } from "mobx-react"
import Copy from "./components/Copy"
import DApps from "../dapp-store"

const elaboxEvent = new EboxEvent(window.location.hostname)
const Dashboard = ({ isMobile }) => {
  const { ela, eid, esc,feeds,carrier } = RootStore.blockchain
  const location = useLocation()
  useEffect(() => {
    if(location.pathname.includes('ela.mainchain')){
      elaboxEvent.subscribe("ela.mainchain.action.UPDATE", res =>{
        console.log(res)
      })      
      elaboxEvent.on("ela.mainchain", args => {
        const updatedEla = {...ela,...args.data}
        RootStore.blockchain.ela.update(updatedEla)
      })          
    }
    else if(location.pathname.includes("ela.esc")){
      elaboxEvent.subscribe("ela.esc.action.UPDATE", res =>{
        console.log(res)
      })      
      elaboxEvent.on("ela.esc", args => {
        const updatedEsc = {...esc,...args.data}
        RootStore.blockchain.esc.update(updatedEsc)
      })                
    }
    else{
      elaboxEvent.off("ela.mainchain")
      elaboxEvent.off("ela.esc")
    }
     return ()=>{
      elaboxEvent.off("ela.mainchain")
      elaboxEvent.off("ela.esc")      
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
          (appId,node) => {
            let blockData = node;
            let MetaMask = <></>
            switch (appId) {
              case "ela.esc":
                  MetaMask = <div style={{ marginTop: 20 }}>
                    <h4>Access details</h4>
                    <Copy id="Ip" label="IP" data={`http://${window.location.hostname}:${esc?.port}`}/>
                    <Copy id="ChainId" label="Chain ID" data={esc?.chainId}/>                                 
                  </div>     
                  break;
            }
            if(blockData !== ""){
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
