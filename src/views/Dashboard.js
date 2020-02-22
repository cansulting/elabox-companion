import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  ButtonGroup,
  CardBody,
  Col,
  Row,
  Card,
  CardGroup
} from "reactstrap";
import Widget02 from './widgets/Widget02';
import Widget04 from './widgets/Widget04';
import mainchainLogo from './images/mainchain_white.png'
import didLogo from './images/did_white.png'
import carrierLogo from './images/carrier_white.png'


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
    
        // this.toggle = this.toggle.bind(this);
        // this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    
        this.state = {
          blocktime: "...",
          blockhash: '...',
          miner:'...',
          latestNbOfTx: 0,
          latestSize:0,
          blockheight: 0,

          blockheightDid: 0,
          blocktimeDid: "...",
          blockhashDid: '...',
          minerDid:'...',
          latestNbOfTxDid: 0,
          latestSizeDid:0,
          carrierIp: '',

          dropdownOpen: false,
          radioSelected: 2
        };
      }
    
    
      componentDidMount() {
        fetch("http://elabox.local:3001/latestblock")
          .then(response => response.json())
          .then(responseJson => {
            let nodeinfo = JSON.parse(responseJson.nodeinfo);
            let nodeinfoDid = JSON.parse(responseJson.nodeinfodid);
            fetch("http://elabox.local:3001/blocksizes")
              .then(response => response.json())
              .then(responseJson => {
                // mainchain
                let blockSizeList = responseJson.blockSizeList
                let blockTime = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format( new Date(responseJson.blockTime * 1000) );
                let blockHash = responseJson.blockHash;
                let blockHashFormatted = blockHash.substring(0, 9)+"..."+blockHash.substring(54, 64);
                let blockMiner = responseJson.miner;
                // DID
                let blockSizeListDid = responseJson.blockSizeListDid
                let blockTimeDid = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format( new Date( responseJson.blockTimeDid * 1000) ) ;
                let blockHashDid = responseJson.blockHashDid;
                let blockHashFormattedDid = blockHashDid.substring(0, 9)+"..."+blockHashDid.substring(54, 64);
                let blockMinerDid = responseJson.minerDid;

                fetch("http://elabox.local:3001/serviceStatus")
                  .then(response => response.json())
                  .then(responseJson => {
                    console.log(blockMiner)
                    let elaRunning = responseJson.elaRunning;
                    let didRunning = responseJson.didRunning;
                    let carrierRunning = responseJson.carrierRunning;
                    let tokenRunning = responseJson.tokenRunning;
                    let carrierIp = responseJson.carrierIp
                    fetch("http://elabox.local:3001/nbOfTx")
                      .then(response => response.json())
                      .then(responseJson => {

                        this.setState({blockheight: nodeinfo.result, blockheightDid: nodeinfoDid.result, blocktime: blockTime, blocktimeDid: blockTimeDid, blockSizeList: blockSizeList, blockSizeListDid: blockSizeListDid, blockhash: blockHashFormatted, blockhashDid: blockHashFormattedDid, miner: blockMiner, minerDid: blockMinerDid, latestSize: blockSizeList[9], latestSizeDid: blockSizeListDid[9], nbOfTxList: responseJson.nbOfTxList, latestNbOfTx: responseJson.nbOfTxList[9], nbOfTxListDid: responseJson.nbOfTxListDid, latestNbOfTxDid: responseJson.nbOfTxListDid[9], elaRunning, didRunning, carrierRunning, tokenRunning, carrierIp })
                      });
                  });
              });
          });
        }

  render() {




    var cardChartData1 = {
      labels: ["       ", " ", " ", " ", " ", " ", " ", " ", " ", "       "],
      datasets: [ { data: this.state.blockSizeList } ]
    };
  
  var cardChartOpts1 = {
    tooltips: {
      enabled: true,
    },
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            color: "transparent",
            zeroLineColor: "transparent"
          },
          ticks: {
            fontSize: 2,
            fontColor: "transparent"
          }
        }
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            display: false,
            min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 1000,
            max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 1000
          }
        }
      ]
    },
    elements: {
      line: {
        borderWidth: 2,
        borderColor: '#2C71F6',
        fill: false
      },
      point: {
        radius: 4,
        backgroundColor: '#2C71F6',
        hitRadius: 10,
        hoverRadius: 6
      }
    }
  };
  
  
  // Card Chart 2
  const cardChartData2 = {
    labels: ["       ", " ", " ", " ", " ", " ", " ", " ", " ", "       "],
    datasets: [{ data: this.state.nbOfTxList }]
  };
  
  const cardChartOpts2 = {
    tooltips: {
      enabled: true,
    },
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            color: "transparent",
            zeroLineColor: "transparent"
          },
          ticks: {
            fontSize: 2,
            fontColor: "transparent"
          }
        }
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            display: false,
            min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
            max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5 
          }
        }
      ]
    },
    elements: {
      line: {
        borderWidth: 2,
        borderColor: '#2C71F6',
        fill: false
      },
      point: {
        radius: 4,
        backgroundColor: '#2C71F6',
        hitRadius: 10,
        hoverRadius: 6
      }
    }
  };


    // Card Chart 2
    const cardChartData3 = {
      labels: ["       ", " ", " ", " ", " ", " ", " ", " ", " ", "       "],
      datasets: [{ data: this.state.blockSizeListDid }]
    };
    
    const cardChartOpts3 = {
      tooltips: {
        enabled: true,
      },
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: "transparent",
              zeroLineColor: "transparent"
            },
            ticks: {
              fontSize: 2,
              fontColor: "transparent"
            }
          }
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              display: false,
              min: Math.min.apply(Math, cardChartData3.datasets[0].data) - 5,
              max: Math.max.apply(Math, cardChartData3.datasets[0].data) + 5
            }
          }
        ]
      },
      elements: {
        line: {
          borderWidth: 2,
          borderColor: '#D048B6',
          fill: false
        },
        point: {
          radius: 4,
          backgroundColor: '#D048B6',
          hitRadius: 10,
          hoverRadius: 6
        }
      }
    };


        // Card Chart 2
        const cardChartData4 = {
          labels: ["       ", " ", " ", " ", " ", " ", " ", " ", " ", "       "],
          datasets: [{ data: this.state.nbOfTxListDid }]
        };
        
        const cardChartOpts4 = {
          tooltips: {
            enabled: true,
          },
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: "transparent",
                  zeroLineColor: "transparent"
                },
                ticks: {
                  fontSize: 2,
                  fontColor: "transparent"
                }
              }
            ],
            yAxes: [
              {
                display: false,
                ticks: {
                  display: false,
                  min: Math.min.apply(Math, cardChartData4.datasets[0].data) - 5,
                  max: Math.max.apply(Math, cardChartData4.datasets[0].data) + 5
                }
              }
            ]
          },
          elements: {
            line: {
              borderWidth: 2,
              borderColor: '#D048B6',
              fill: false
            },
            point: {
              radius: 4,
              backgroundColor: '#D048B6',
              hitRadius: 10,
              hoverRadius: 6
            }
          }
        };

    return ( 
        <div id='main' style={{paddingLeft:'18%', height:'100%', width:'100%', backgroundColor:'#1E1E26'}} className="animated fadeIn w3-container">
            <Row>
              <Col xs="12" sm="4" lg="4">
                {this.state.elaRunning 
                ? <Widget02 header="ELA" mainText="Running" icon={mainchainLogo} color="success" variant="1" />
                : <Widget02 header="ELA" mainText="Stopped" icon={mainchainLogo} color="danger" variant="1" />
                }
              </Col>
            </Row>

            <CardGroup className="mb-4">
              <Widget04 icon="fa fa-gears" header={this.state.blockheight} >Best block</Widget04>
              <Widget04 icon="fa fa-clock-o" header={this.state.blocktime} >Block Time</Widget04>
              <Widget04 icon="fa fa-hashtag" header={this.state.blockhash} >Block Hash</Widget04>
              <Widget04 icon="fa fa-gears" header={this.state.miner}>MINER</Widget04>
            </CardGroup>

            <Row>
              <Col xs="12" sm="6" lg="6 ">
                <Card className="text-white" style={{backgroundColor: '#272A3D'}}> 
                  <CardBody className="pb-0">
                    <div>Transactions per block</div>
                    <div className="text-value">{this.state.latestNbOfTx}</div>
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
                <Card className="text-white" style={{backgroundColor: '#272A3D'}}>
                  <CardBody className="pb-0">
                    <ButtonGroup className="float-right">
                    </ButtonGroup>
                    <div>Latest block size</div>
                    <div className="text-value">{this.state.latestSize}</div>
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


            <Row style={{paddingTop: '50px'}}>
              <Col xs="12" sm="4" lg="4">
                {this.state.didRunning
                ? <Widget02 header="DID" mainText="Running" icon={didLogo} color="success" variant="1" />
                : <Widget02 header="DID" mainText="Stopped" icon={didLogo} color="danger" variant="1" />
                }
              </Col>
            </Row>

            <CardGroup className="mb-4">
              <Widget04 icon="fa fa-gears" header={this.state.blockheightDid} >Best block</Widget04>
              <Widget04 icon="fa fa-clock-o" header={this.state.blocktimeDid} >Block Time</Widget04>
              <Widget04 icon="fa fa-hashtag" header={this.state.blockhashDid} >Block Hash</Widget04>
              <Widget04 icon="fa fa-gears" header={this.state.minerDid}>MINER</Widget04>
            </CardGroup>

            <Row>
              <Col xs="12" sm="6" lg="6 ">
                <Card className="text-white" style={{backgroundColor: '#272A3D'}}> 
                  <CardBody className="pb-0">
                    <div>Transactions per block</div>
                    <div className="text-value">{this.state.latestNbOfTxDid}</div>
                  </CardBody>
                  <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                    <Line
                      data={cardChartData4}
                      options={cardChartOpts4}
                      height={70}
                    />
                  </div>
                </Card>
              </Col>

              <Col xs="12" sm="6" lg="6">
                <Card className="text-white" style={{backgroundColor: '#272A3D'}}>
                  <CardBody className="pb-0">
                    <ButtonGroup className="float-right">
                    </ButtonGroup>
                    <div>Latest block size</div>
                    <div className="text-value">{this.state.latestSizeDid}</div>
                    {/* <div>Latest block sizes</div> */}
                  </CardBody>
                  <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                    <Line
                      data={cardChartData3}
                      options={cardChartOpts3}
                      height={70}
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            <Row style={{paddingTop: '50px'}}>
              <Col xs="12" sm="4" lg="4">
                {this.state.carrierRunning
                ? <Widget02 header="Carrier" mainText="Running" icon={carrierLogo} color="success" variant="1" />
                : <Widget02 header="Carrier" mainText="Stopped" icon={carrierLogo} color="danger" variant="1" />
                }
              </Col>
            </Row>

            <CardGroup className="mb-4">
              <Widget04 icon="fa fa-gears" header={this.state.carrierIp} >Carrier IP Address</Widget04>
            </CardGroup>
        </div>
    )
  }
}

export default Dashboard;