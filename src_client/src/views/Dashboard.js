import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { Button,  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader } from "reactstrap"
import NodePreview from "./components/NodePreviewer"
import { ButtonGroup, CardBody, Col, Row, Card, CardGroup } from "reactstrap"
import Widget02 from "./widgets/Widget02"
import Widget04 from "./widgets/Widget04"
import mainchainLogo from "./images/mainchain_white.png"
import didLogo from "./images/did_white.png"
import carrierLogo from "./images/carrier_white.png"
import feedsLogo from "./images/feeds-logo.png"
import glideLogo from "./images/glide-logo.png"
import RootStore from "../store"
import { observer } from "mobx-react"
import { formatTime } from "../utils/time"
import { shortifyHash } from "../utils/string"
import { ENABLE_EID } from "../config"
import Copy from "./components/Copy"
import DApps from "../dapp-store"

const Dashboard = ({ isMobile }) => {
  const [showEscInfoModal,setShowEscInfoModal]=useState(false)
  const { ela, eid, carrier, esc, feeds } = RootStore.blockchain
  useEffect(() => {}, [])

  var cardChartData1 = {
    labels: ["       ", " ", " ", " ", " ", " ", " ", " ", " ", "       "],
    datasets: [{ data: RootStore.blockchain.ela.blockSizes.slice().reverse() }],
  }

  var cardChartOpts1 = {
    tooltips: {
      enabled: true,
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            color: "transparent",
            zeroLineColor: "transparent",
          },
          ticks: {
            fontSize: 2,
            fontColor: "transparent",
          },
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            display: false,
            min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 1000,
            max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 1000,
          },
        },
      ],
    },
    elements: {
      line: {
        borderWidth: 2,
        borderColor: "#2C71F6",
        fill: false,
      },
      point: {
        radius: 4,
        backgroundColor: "#2C71F6",
        hitRadius: 10,
        hoverRadius: 6,
      },
    },
  }

  // Card Chart 2
  const cardChartData2 = {
    labels: ["       ", " ", " ", " ", " ", " ", " ", " ", " ", "       "],
    datasets: [{ data: RootStore.blockchain.ela.nbOfTxs.slice().reverse() }],
  }

  const cardChartOpts2 = {
    tooltips: {
      enabled: true,
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            color: "transparent",
            zeroLineColor: "transparent",
          },
          ticks: {
            fontSize: 2,
            fontColor: "transparent",
          },
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            display: false,
            min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
            max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
          },
        },
      ],
    },
    elements: {
      line: {
        borderWidth: 2,
        borderColor: "#2C71F6",
        fill: false,
      },
      point: {
        radius: 4,
        backgroundColor: "#2C71F6",
        hitRadius: 10,
        hoverRadius: 6,
      },
    },
  }
  const handleShowInfoModal=()=>{
    setShowEscInfoModal(true)
  }
  const handleCloseEscInfoModal=()=>{
    setShowEscInfoModal(false)
  }
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
      <DApps>
        {
          app => {
            let blockData = "";
            let MetaMask = <></>
            switch (app.id) {
              case "ela.eid":
                  blockData = eid
                break;
              case "ela.esc":
                  blockData = esc       
                  MetaMask = <>
                    <img src={didLogo} style={{ marginTop: 20, width: "50px", height: "50px",marginBottom: 5 }}/>              
                    <Copy id="Ip" label="IP" data={`http://${window.location.hostname}:${esc?.port}`}/>
                    <Copy id="ChainId" label="Chain ID" data={esc?.chainId}/>                                 
                  </>     
                  break;
              case "ela.mainchain":
                blockData = ela
                break;
              default:
                blockData=""
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
