import React, { Component } from "react";
import {
  Row,
  Col,
  Table,
  Card,
  CardBody,
  Form,
  CardFooter,
  CardDeck,
  CardHeader,
  Button,
  Input,
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Spinner,
} from "reactstrap";
// import BootstrapTable from 'react-bootstrap-table-next';
import copy from "copy-to-clipboard";
import checkLogo from "./images/check.png";
import errorLogo from "./images/error.png";
import backend from "../api/backend";
var QRCode = require("qrcode.react");

// STATES
const STATE_NONE = 0
const STATE_START_SEND = 1
const STATE_PROCESSING = 2
const STATE_SUCCESS = 3
const STATE_ERROR1 = 4
const STATE_ERROR_PASS = 5
const STATE_REQUEST_PROCESS = 6
const STATE_NOADDRESS = 7
const STATE_NOAMOUNT = 8
const STATE_INVALIDAMOUNT = 9

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipient: "",
      amount: "",
      transfer_fee: 0.001,
      tx_list: "",
      pwd: "",
      transferState: STATE_NONE,
      errMsg: "",
      balance:"..."
    };

    this.handleChange = this.handleChange.bind(this);
    let address = localStorage.getItem("address");
    backend.txHistory(address).then((responseJson) => {
      let tx_list = responseJson.result;

      backend
        .getBalance(address)
        .then((responseJson) => {
          this.setState({ tx_list, balance: responseJson.balance });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  copyToClipboard() {
    let address = localStorage.getItem("address");
    copy(address);
  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [name]: value,
    });
  };

  submitForm = () => {
    // e.preventDefault();

    backend
      .sendTx(this.state.recipient, this.state.amount, this.state.pwd)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.ok == "ok") {
          this.transferStateUpdate(STATE_SUCCESS);
        } else {
          setTimeout(function () {}, 2000);
          this.transferStateUpdate(STATE_ERROR1);
          let msg = "Something went wrong. Please try again later.";
          if (
            responseJson.reason &&
            responseJson.reason.search("not enough utx") >= 0
          )
            msg = "Not enough balance.";
          this.setState({ errMsg: msg });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Verifies password before calling submitForm which calls /sendTx
  verifyPwd = () => {
    this.transferStateUpdate(STATE_PROCESSING);
    backend
      .sendElaPassswordVerification(this.state.pwd)
      .then((responseJson) => {
        if (responseJson.ok) {
          this.transferStateUpdate(STATE_REQUEST_PROCESS);
          this.submitForm();
        } else {
          this.transferStateUpdate(STATE_ERROR_PASS);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  checkForm = () => {
    let recipient = this.state.recipient;
    let amount = this.state.amount;
    if (recipient.length != 34) {
      this.transferStateUpdate(STATE_NOADDRESS);
    } else {
      if (amount.length == 0) {
        this.transferStateUpdate(STATE_NOAMOUNT);
      } else {
        if (isNaN(amount)) {
          this.transferStateUpdate(STATE_NOAMOUNT);
        } else {
          if (amount.indexOf(".") > -1) {
            if (amount.toString().split(".")[1].length > 8) {
              this.transferStateUpdate(STATE_INVALIDAMOUNT);
            } else {
              this.transferStateUpdate(STATE_START_SEND);
            }
          } else {
            this.transferStateUpdate(STATE_START_SEND);
          }
        }
      }
    }
  };

  transferStateUpdate = (state) => {
    this.setState({ transferState: state });
  };

  render() {
    const { isMobile } = this.props;
    const amountWithFee =
      parseFloat(this.state.amount) + this.state.transfer_fee;
    let tx = this.state.tx_list;
    let address = localStorage.getItem("address");
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
        <Modal
          isOpen={
            this.state.transferState === STATE_START_SEND || this.state.transferState === STATE_PROCESSING 
          }
        >
          <ModalHeader>Sending ELA</ModalHeader>
          {this.state.transferState === STATE_START_SEND && (
            <ModalBody>
              <center>
                You are about to sendTx <br />
                <b>{amountWithFee.toFixed(3)} ELA</b>
                <br />
                <b style={{ color: "gray" }}>
                  ({this.state.amount} + {this.state.transfer_fee} Fee)
                </b>
                <br />
                to <br />
                <b>{this.state.recipient}</b> <br />
                <br />
                Enter your wallet password to confirm
                <br />
                <br />
              </center>
              <Input
                data-testid="sending-ela-pasword"
                type="password"
                id="pwd"
                name="pwd"
                placeholder="Enter ELA wallet password"
                required
                onChange={(e) => this.handleChange(e)}
              />
            </ModalBody>
          )}
          {this.state.transferState === STATE_PROCESSING && (
            <ModalBody>
              <center>
                <h4 style={{ margin: "5px", display: "inline-block" }}>
                  Processing{" "}
                </h4>
                <Spinner
                  size="md"
                  style={{ margin: "0 5px", display: "inline-block" }}
                />
              </center>
            </ModalBody>
          )}
          <ModalFooter>
            {this.state.transferState === STATE_START_SEND && (
              <>
                <Button
                  data-testid="sending-ela-send-btn"
                  color="success"
                  onClick={this.verifyPwd}
                >
                  Send
                </Button>
                <Button
                  data-testid="sending-ela-cancel-btn"
                  color="danger"
                  onClick={(_) => this.transferStateUpdate(STATE_NONE)}
                >
                  Cancel
                </Button>
              </>
            )}
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.transferState === STATE_SUCCESS}>
          <ModalHeader>Sent</ModalHeader>
          <ModalBody>
            <center>
              <img src={checkLogo} style={{ width: "50px", height: "50px" }} />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={(_) => this.transferStateUpdate(STATE_NONE)}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.transferState === STATE_ERROR1}>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <center>
              {this.state.errMsg}
              <br />
              <br />
              <img src={errorLogo} style={{ width: "50px", height: "50px" }} />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={(_) => this.transferStateUpdate(STATE_NONE)}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.transferState === STATE_ERROR_PASS}>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <center>
              Invalid password, please try again
              <br />
              <br />
              <img src={errorLogo} style={{ width: "50px", height: "50px" }} />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={(_) => this.transferStateUpdate(STATE_NONE)}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.transferState === STATE_REQUEST_PROCESS}>
          <ModalHeader>Success</ModalHeader>
          <ModalBody>
            <center>
              Your request is now being processed.
              <br />
              <img src={checkLogo} style={{ width: "50px", height: "50px" }} />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={(_) => this.transferStateUpdate(STATE_NONE)}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.transferState >= STATE_NOADDRESS}>
          {this.state.transferState === STATE_NOADDRESS && (
            <>
              <ModalHeader>Incorrect ELA Address</ModalHeader>
              <ModalBody>Please provide a correct ELA address</ModalBody>
            </>
          )}
          {this.state.transferState === STATE_NOAMOUNT && (
            <>
              <ModalHeader>Incorrect Amount</ModalHeader>
              <ModalBody>Please provide amount of ELA to send</ModalBody>
            </>
          )}
          {this.state.transferState === STATE_INVALIDAMOUNT && (
            <>
              <ModalHeader>Incorrect Amount</ModalHeader>
              <ModalBody>Too many decimals</ModalBody>
            </>
          )}
          <ModalFooter>
            <Button
              color="primary"
              onClick={(_) => this.transferStateUpdate(STATE_NONE)}
            >
              Ok
            </Button>
          </ModalFooter>
        </Modal>

        <CardDeck>
          {/* <Row>
          <Col xs="12" md="4"> */}
          <Card style={{ backgroundColor: "#272A3D", color: "white" }}>
            <CardHeader>
              <strong>Balance</strong>
            </CardHeader>
            <CardBody>
              <div className="h-100 d-flex flex-column text-center justify-content-center align-items-center">
                <div data-testid="balance" className="p-2">
                  <h1>{this.state.balance}</h1>
                </div>
                <div className="p-2">
                  <h4>ELA</h4>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card style={{ backgroundColor: "#272A3D", color: "white" }}>
            <Form className="form" onSubmit={this.verifyPwd}>
              <CardHeader>
                <strong>Send ELA</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="name">Recipient's address</Label>
                      <Input
                        type="text"
                        data-testid="recipient"
                        id="recipient"
                        name="recipient"
                        placeholder="ELA wallet address"
                        required
                        onChange={(e) => this.handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="ccnumber">Amount (in ELA)</Label>
                      <Input
                        type="text"
                        data-testid="amount"
                        id="amount"
                        name="amount"
                        placeholder="1"
                        required
                        onChange={(e) => this.handleChange(e)}
                      />
                      fee: {this.state.transfer_fee} ELA
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                {/* <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Send</Button> */}
                <Button
                  data-testid="send"
                  color="success"
                  onClick={this.checkForm}
                  disabled={
                    this.state.recipient === "" ||
                    this.state.recipient.length !== 34 ||
                    this.state.amount === "" ||
                    parseFloat(this.state.amount) <= 0 ||
                    isNaN(this.state.amount)
                  }
                >
                  Send
                </Button>
              </CardFooter>
            </Form>
          </Card>
          <Card style={{ backgroundColor: "#272A3D", color: "white" }}>
            <CardHeader>
              <strong>Receive ELA</strong>
            </CardHeader>
            <CardBody>
              <center
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <QRCode data-testid="qr-code" value={address} />
                <br />
                {address}
              </center>
            </CardBody>
            <CardFooter>
              <Button
                data-testid="copy-qr"
                color="success"
                onClick={this.copyToClipboard}
              >
                Copy to clipboard
              </Button>
              {/* <Button type="submit" size="sm" color="success" onClick={this.copyToClipboard}><i className="fa fa-dot-circle-o"></i> Copy to clipboard</Button> */}
            </CardFooter>
          </Card>
        </CardDeck>

        <Row style={{ paddingTop: "20px" }}>
          <Col>
            <Card style={{ backgroundColor: "#272A3D", color: "white" }}>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Recent transactions
              </CardHeader>
              <CardBody>
                <Table
                  data-testid="transactions-table"
                  responsive
                  striped
                  style={{ color: "white" }}
                >
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>More detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tx && tx.length ? (
                      tx.map((tx) => (
                        <tr key={tx.Txid}>
                          <td>
                            {tx.Type === 1 ? (
                              <i
                                className="fa fa-arrow-up"
                                style={{ color: "green" }}
                              ></i>
                            ) : (
                              <i
                                className="fa fa-arrow-down"
                                style={{ color: "red" }}
                              ></i>
                            )}
                          </td>
                          <td>{tx.amount}</td>
                          {tx.CreateTime < 10 ? (
                            <td>-</td>
                          ) : (
                            <td>
                              {new Date(tx.CreateTime * 1000).toDateString()}
                            </td>
                          )}
                          <td>{tx.Status}</td>
                          <td>
                            {" "}
                            <a
                              href={`https://blockchain.elastos.org/tx/${tx.Txid}`}
                            >
                              See more
                            </a>{" "}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Wallet;
