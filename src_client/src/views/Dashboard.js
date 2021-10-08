import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Button } from "reactstrap";
import NodePreview from "./components/NodePreviewer";
import { ButtonGroup, CardBody, Col, Row, Card, CardGroup,  Modal, ModalHeader, ModalFooter, ModalBody  } from "reactstrap";
import Widget02 from "./widgets/Widget02";
import Widget04 from "./widgets/Widget04";
import mainchainLogo from "./images/mainchain_white.png";
import carrierLogo from "./images/carrier_white.png";
import feedsLogo from "./images/feeds-logo.png";
import RootStore from "../store";
import { observer } from "mobx-react";
import { formatTime } from "../utils/time";
import { shortifyHash } from "../utils/string";



const Dashboard = ({ isMobile }) => {
  const { ela, eid, carrier, esc, feeds } = RootStore.blockchain;
  useEffect(() => {}, []);
  const [Dialogmodal, setDialogmodal] = useState(false)


  const dialogtoggle = () => {
    setDialogmodal(true)
  }

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
              dialog={dialogtoggle}
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
    
      <NodePreview blockdata={eid} label="EID" dialog={dialogtoggle}/>
      <NodePreview blockdata={esc} label="ESC"  dialog={dialogtoggle}/>

      <Row style={{ paddingTop: "50px" }}>
        <Col xs="12" sm="4" lg="4">
          <Widget02
            header="Feeds"
            mainText={`${feeds.isRunning ? "Running" : "Stopped"}`}
            icon={feedsLogo}
            color={`${feeds.isRunning ? "success" : "danger"}`}
            variant="1"
            status="Node not running"
            children={
              feeds.isRunning && (
                <Button
                  as="achor"
                  style={{
                    marginLeft: "5em",
                    marginTop: "0.5em",
                    width: "17em",
                  }}
                  color="success"
                  target="_blank"
                  href="http://elabox.local:10018/"
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
              status="Node not running"

            />
          )}
        </Col>
      </Row>

      <CardGroup className="mb-4">
        <Widget04 icon="fa fa-gears" header={carrier.carrierIP}>
          Carrier IP Address
        </Widget04>
      </CardGroup>

      <Modal isOpen={Dialogmodal}>
          <ModalHeader>Dialog: </ModalHeader>
          <ModalBody>
            <center>
              <br />
              Node not running.
              <br />
              <br />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" href="/settings" >Resync</Button>
            <Button color="danger" onClick=
            {() => {
              setDialogmodal(false)
            }}
            >Cancel</Button>
          </ModalFooter>
        </Modal>



    </div>
  )
}

export default observer(Dashboard)
