import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { Button,  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader, } from "reactstrap"
  import {CopyToClipboard} from 'react-copy-to-clipboard';  
import NodePreview from "./components/NodePreviewer"
import {AiFillCopy} from "react-icons/ai"
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
        <Modal isOpen={showEscInfoModal}>
          <ModalHeader>Esc Info</ModalHeader>
          <ModalBody>
            <center>
            <img src={didLogo} style={{ width: "50px", height: "50px",marginBottom: 5 }} />              
            <p style={{fontSize: 20}}>Hostname: {esc?.hostname}<CopyToClipboard text={esc?.hostname}
                onCopy={() =>{alert("hostname copied to clipboard")}}>
                  <Button color="success" style={{marginLeft:3}} size="sm"><AiFillCopy/></Button>
              </CopyToClipboard>              
              </p>
              <p style={{fontSize: 20}}>port: {esc?.port} <CopyToClipboard text={esc?.port}
                onCopy={() =>{alert("port copied to clipboard")}}>
                  <Button color="success" style={{marginLeft:3}} size="sm"><AiFillCopy/></Button>
              </CopyToClipboard></p>              
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleCloseEscInfoModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>      
      <Row>
        <Col xs="12" sm="4" lg="4">
          {ela.isRunning ? (
            <Widget02
              header="ELA"
              mainText="Running"
              icon={mainchainLogo}
              color="success"
              variant="1"
              initializing={!ela.servicesRunning}
            />
          ) : (
            <Widget02
              header="ELA"
              mainText="Stopped"
              icon={mainchainLogo}
              color="danger"
              variant="1"
            />
          )}
        </Col>
      </Row>

      <CardGroup className="mb-4">
        <Widget04 icon="fa fa-gears" header={ela.blockCount.toString()}>
          Best block
        </Widget04>
        <Widget04
          icon="fa fa-clock-o"
          header={formatTime(ela.latestBlock.blockTime)}
        >
          Block Time
        </Widget04>
        <Widget04
          icon="fa fa-hashtag"
          header={shortifyHash(ela.latestBlock.blockHash)}
        >
          Block Hash
        </Widget04>
        <Widget04 icon="fa fa-gears" header={ela.latestBlock.miner}>
          MINER
        </Widget04>
      </CardGroup>

      <Row>
        <Col xs="12" sm="6" lg="6 ">
          <Card className="text-white" style={{ backgroundColor: "#272A3D" }}>
            <CardBody className="pb-0">
              <div>Transactions per block</div>
              <div className="text-value">{ela.nbOfTxs[0]}</div>
            </CardBody>
            <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
              <Line
                data={cardChartData2}
                options={cardChartOpts2}
                height={70}
              />
            </div>
          </Card>
        </Col>

        <Col xs="12" sm="6" lg="6">
          <Card className="text-white" style={{ backgroundColor: "#272A3D" }}>
            <CardBody className="pb-0">
              <ButtonGroup className="float-right"></ButtonGroup>
              <div>Latest block size</div>
              <div className="text-value">{ela.blockSizes[0]}</div>
              {/* <div>Latest block sizes</div> */}
            </CardBody>
            <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
              <Line
                data={cardChartData1}
                options={cardChartOpts1}
                height={70}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <NodePreview blockdata={eid} label="EID" />
      <NodePreview blockdata={esc} label="ESC" showInfo={handleShowInfoModal}/>
      <Row style={{ paddingTop: "50px" }}>
        <Col xs="12" sm="4" lg="4">
          <Widget02
            header="Feeds"
            mainText={`${feeds.isRunning ? "Running" : "Stopped"}`}
            icon={feedsLogo}
            color={`${feeds.isRunning ? "success" : "danger"}`}
            variant="1"
            children={
              feeds.isRunning && (
                <Button
                as="achor"
                style={{
                  marginTop: "0.5em",
                  width: "100%",
                }}
                color="success"
                target="_blank"
                href={"http://" + window.location.hostname + ":10018/"}
              >
                Launch
              </Button>

              )
            }
          />
        </Col>
      </Row>
      <Row style={{ paddingTop: "50px" }}>
        <Col xs="12" sm="4" lg="4">
          <Widget02
            header="Glide"
            mainText="Running"
            icon={glideLogo}
            color='success'
            variant="1"
            children={
              (
                <Button
                as="achor"
                style={{
                  marginTop: "0.5em",
                  width: "100%",
                }}
                color="success"
                target="_blank"
                href={"http://" + window.location.hostname + "/glide"}
              >
                Launch
              </Button>

              )
            }
          />
        </Col>
      </Row>      
      <Row style={{ paddingTop: "50px" }}>
        <Col xs="12" sm="4" lg="4">
          {carrier.isRunning ? (
            <Widget02
              header="Carrier"
              mainText="Running"
              icon={carrierLogo}
              color="success"
              variant="1"
            />
          ) : (
            <Widget02
              header="Carrier"
              mainText="Stopped"
              icon={carrierLogo}
              color="danger"
              variant="1"
            />
          )}
        </Col>
      </Row>

      <CardGroup className="mb-4">
        <Widget04 icon="fa fa-gears" header={carrier.carrierIP}>
          Carrier IP Address
        </Widget04>
      </CardGroup>
    </div>
  )
}

export default observer(Dashboard)
