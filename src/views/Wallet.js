import React, { Component } from 'react';
import { Row, Col, Table, Card, CardBody, Form, CardFooter, CardDeck, CardHeader, Button, Input, Label, FormGroup, Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap'
// import BootstrapTable from 'react-bootstrap-table-next';
import copy from 'copy-to-clipboard';
import checkLogo from './images/check.png'
import errorLogo from './images/error.png'
import backend from "../api/backend"
var QRCode = require('qrcode.react');


class Wallet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'recipient': '',
      'amount': '',
      'tx_list': '',
      'pwd': '',
      'error1modal': false,
      'error2modal': false,
      'error3modal': false,
      'pwdmodal': false,
      'sentmodal': false,
      'errormodal': false
    }

    this.handleChange = this.handleChange.bind(this);
    let address = localStorage.getItem('address')
    backend.txHistory(address)
      .then(responseJson => {
        let tx_list = responseJson.result.History

        backend.getBalance(address)
          .then(responseJson => {
            this.setState({ tx_list, balance: responseJson.balance })
          })
          .catch(error => {
            console.error(error);
          });

      });
  }

  copyToClipboard() {
    let address = localStorage.getItem('address')
    copy(address)
  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [name]: value,
    });
  }


  submitForm = () => {
    // e.preventDefault();
    this.setState({ pwdmodal: false })

    backend.sendTx(this.state.recipient, this.state.amount, this.state.pwd)
      .then(responseJson => {
        console.log(responseJson)
        if (responseJson.ok == 'ok') {
          this.setState({ sentmodal: true })
        }
        else {
          this.setState({ errormodal: true })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  checkForm = () => {
    let recipient = this.state.recipient
    let amount = this.state.amount
    if (recipient.length != 34) {
      this.setState({ error1modal: true })
    }
    else {
      if (amount.length == 0) {
        this.setState({ error2modal: true })
      }
      else {
        if (isNaN(amount)) {
          this.setState({ error2modal: true })
        }
        else {
          if (amount.toString().split(".")[1].length > 8) {
            this.setState({ error3modal: true })
          }
          else {
            this.setState({ pwdmodal: true })
          }
        }
      }
    }
  }

  error1toggle = () => {
    this.setState({ error1modal: false })
  }
  error2toggle = () => {
    this.setState({ error2modal: false })
  }
  error3toggle = () => {
    this.setState({ error3modal: false })
  }
  senttoggle = () => {
    this.setState({ recipient: '', amount: '', sentmodal: false })
  }
  errortoggle = () => {
    this.setState({ errormodal: false })
  }
  pwdmodaltoggle = () => {
    this.setState({ pwdmodal: false })
  }

  render() {

    let tx = this.state.tx_list
    let address = localStorage.getItem('address')
    return (
      <div id='main' style={{ paddingLeft: '18%', height: '100%', width: '100%', backgroundColor: '#1E1E26' }} className="animated fadeIn w3-container">

        <Modal isOpen={this.state.pwdmodal}>
          <ModalHeader>Sending ELA</ModalHeader>
          <ModalBody>
            <center>
              You are about to sendTx <br />
              <b>{this.state.amount} ELA </b><br />
            to <br />
              <b>{this.state.recipient}</b> <br /><br />
            Enter your wallet password to confirm<br /><br />
            </center>
            <Input type="password" id="pwd" name="pwd" placeholder="Enter ELA wallet password" required onChange={(e) => this.handleChange(e)} />
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.submitForm} >Send</Button>
            <Button color="danger" onClick={this.pwdmodaltoggle} >Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.sentmodal}>
          <ModalHeader>Sent</ModalHeader>
          <ModalBody>
            <center>
              <img src={checkLogo} style={{ width: '50px', height: '50px' }} />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.senttoggle} >Close</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.errormodal}>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <center>
              Something went wrong, please try again<br /><br />
              <img src={errorLogo} style={{ width: '50px', height: '50px' }} />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.errortoggle} >Close</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.error1modal}>
          <ModalHeader>Error ELA address</ModalHeader>
          <ModalBody>
            Please provide a correct ELA address
        </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.error1toggle} >Ok</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.error2modal}>
          <ModalHeader>Error amount</ModalHeader>
          <ModalBody>
            Please provide amount of ELA to send
        </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.error2toggle} >Ok</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.error3modal}>
          <ModalHeader>Error amount</ModalHeader>
          <ModalBody>
            Too many decimals
        </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.error3toggle} >Ok</Button>
          </ModalFooter>
        </Modal>

        <CardDeck>
          {/* <Row>
          <Col xs="12" md="4"> */}
          <Card style={{ backgroundColor: '#272A3D', color: 'white' }}>
            <CardHeader>
              <strong>Balance</strong>
            </CardHeader>
            <CardBody >
              <div className="h-100 d-flex flex-column text-center justify-content-center align-items-center">
                <div className="p-2"><h1>{this.state.balance}</h1></div>
                <div className="p-2"><h4>ELA</h4></div>
              </div>

            </CardBody>
          </Card>
          <Card style={{ backgroundColor: '#272A3D', color: 'white' }}>
            <Form className="form" onSubmit={(e) => this.submitForm(e)}>
              <CardHeader>
                <strong>Send ELA</strong>
              </CardHeader>
              <CardBody>

                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="name">Recipient's address</Label>
                      <Input type="text" id="recipient" name="recipient" placeholder="ELA wallet address" required onChange={(e) => this.handleChange(e)} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="ccnumber">Amount (in ELA)</Label>
                      <Input type="text" id="amount" name="amount" placeholder="1" required onChange={(e) => this.handleChange(e)} />
                          fee: 0.001 ELA
                        </FormGroup>
                  </Col>
                </Row>

              </CardBody>
              <CardFooter>
                {/* <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Send</Button> */}
                <Button color="success" onClick={this.checkForm} >Send</Button>
              </CardFooter>
            </Form>
          </Card>
          <Card style={{ backgroundColor: '#272A3D', color: 'white' }}>
            <CardHeader>
              <strong>Receive ELA</strong>
            </CardHeader>
            <CardBody>
              <center>
                <QRCode value={address} />
                {address}
              </center>

            </CardBody>
            <CardFooter>
              <Button color="success" onClick={this.copyToClipboard}>Copy to clipboard</Button>
              {/* <Button type="submit" size="sm" color="success" onClick={this.copyToClipboard}><i className="fa fa-dot-circle-o"></i> Copy to clipboard</Button> */}
            </CardFooter>
          </Card>
        </CardDeck>


        <Row style={{ paddingTop: '20px' }}>
          <Col>
            <Card style={{ backgroundColor: '#272A3D', color: 'white' }}>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Recent transactions
              </CardHeader>
              <CardBody>
                <Table responsive striped style={{ color: 'white' }}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Memo</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>More detail</th>
                    </tr>
                  </thead>
                  <tbody>

                    {tx.length ?
                      tx.map(tx => (
                        <tr key={tx.Txid}>
                          <td>
                            {tx.Type == "income" ? <i className="fa fa-arrow-up" style={{ color: 'green' }}></i> : <i className="fa fa-arrow-down" style={{ color: 'red' }}></i>}
                          </td>
                          <td>{tx.Value / 100000000}</td>
                          <td>{tx.Memo.split("msg:")[1]}</td>
                          {tx.CreateTime < 10 ? <td>-</td> : <td>{new Date(tx.CreateTime * 1000).toDateString()}</td>}
                          {/* <td>{new Date(tx.CreateTime * 1000).toDateString()}</td> */}
                          <td>{tx.Status}</td>
                          <td> <a href={`https://blockchain.elastos.org/tx/${tx.Txid}`} >See more</a> </td>
                        </tr>
                      ))
                      :
                      (<tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>)
                    }
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
