import React, { useState, useEffect} from 'react'
import {  Line } from "react-chartjs-2";
import { ButtonGroup, CardBody, Col, Row, Card, CardGroup } from "reactstrap";
import Widget02 from "../../widgets/Widget02";
import Widget04 from "../../widgets/Widget04";
//import { event_server } from '../../../Socket'
import didLogo from "../../images/did_white.png";
import { formatTime } from "../../../utils/time";
import { shortifyHash } from "../../../utils/string";

// Card Chart 2
const cardChartData3 = (blockdata) => ({
  labels: ["       ", " ", " ", " ", " ", " ", " ", " ", " ", "       "],
  datasets: [{ data: blockdata.blockSizes.slice() }],
});
// Card Chart 4
const cardChartData4 = (blockdata) => ({
  labels: ["       ", " ", " ", " ", " ", " ", " ", " ", " ", "       "],
  datasets: [{ data: blockdata.nbOfTxs.slice() }],
});

const cardChartOpts3 = (blockdata) => ({
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
          min: Math.min.apply(Math, cardChartData3(blockdata).datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData3(blockdata).datasets[0].data) + 5,
        },
      },
    ],
  },
  elements: {
    line: {
      borderWidth: 2,
      borderColor: "#D048B6",
      fill: false,
    },
    point: {
      radius: 4,
      backgroundColor: "#D048B6",
      hitRadius: 10,
      hoverRadius: 6,
    },
  },
});

const cardChartOpts4 = (blockdata) => ({
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
          min: Math.min.apply(Math, cardChartData4(blockdata).datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData4(blockdata).datasets[0].data) + 5,
        },
      },
    ],
  },
  elements: {
    line: {
      borderWidth: 2,
      borderColor: "#D048B6",
      fill: false,
    },
    point: {
      radius: 4,
      backgroundColor: "#D048B6",
      hitRadius: 10,
      hoverRadius: 6,
    },
  },
});

const Previewer = (props) => {
  const { blockdata, showInfo , label = 'Node' } = props;
  return (
    <div>
      <Row style={{ paddingTop: "50px" }}>
        <Col xs="12" sm="4" lg="4">
          {blockdata.isRunning ? (
            <Widget02
              header={label}
              showInfo={showInfo}
              mainText="Running"
              icon={didLogo}
              color="success"
              variant="1"
              initializing={!blockdata.servicesRunning}
            />
          ) : (
            <Widget02
              header={label}
              mainText="Stopped"
              icon={didLogo}
              color="danger"
              variant="1"
            />
          )}
        </Col>
      </Row>
      { blockdata.isRunning && blockdata.servicesRunning  &&
      <div>
        <CardGroup className="mb-4">
          <Widget04 icon="fa fa-gears" header={blockdata.blockCount.toString()}>
            Best block
          </Widget04>
          <Widget04
            icon="fa fa-clock-o"
            header={formatTime(blockdata.latestBlock.blockTime)}
          >
            Block Time
          </Widget04>
          <Widget04
            icon="fa fa-hashtag"
            header={shortifyHash(blockdata.latestBlock.blockHash)}
          >
            Block Hash
          </Widget04>
          <Widget04 icon="fa fa-gears" header={blockdata.latestBlock.miner}>
            MINER
          </Widget04>
        </CardGroup>
        <Row>
          <Col xs="12" sm="6" lg="6 ">
            <Card className="text-white" style={{ backgroundColor: "#272A3D" }}>
              <CardBody className="pb-0">
                <div>Transactions per block</div>
                <div className="text-value">{blockdata.nbOfTxs[0]}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                <Line
                  data={cardChartData4(blockdata)}
                  options={cardChartOpts4(blockdata)}
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
                <div className="text-value">{blockdata.blockSizes[0]}</div>
                {/* <div>Latest block sizes</div> */}
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                <Line
                  data={cardChartData3(blockdata)}
                  options={cardChartOpts3(blockdata)}
                  height={70}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      }
     
    </div>
    )
}

export default Previewer