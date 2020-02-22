import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, Input, ModalHeader, Badge, Line, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import Widget05 from './widgets/Widget05';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'pwd': '',
      'mainchainRestartModal' : false,
      'mainchainResyncModal' : false,
      'didRestartModal' : false,
      'didResyncModal': false,
      'carrierRestartModal' : false,
    }
  }


  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [ name ]: value,
    });
  }

  restartMainchain = () => {
    // e.preventDefault();
    this.setState({mainchainRestartModal: false})

    fetch('http://elabox.local:3001/restartMainchain', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pwd: this.state.pwd
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        if (responseJson.ok == 'ok'){
          this.setState({sentmodal: true})
        }
        else{
          this.setState({errormodal: true})
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  restartDid = () => {
    // e.preventDefault();
    this.setState({mainchainRestartModal: false})

    fetch('http://elabox.local:3001/restartMainchain', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pwd: this.state.pwd
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        if (responseJson.ok == 'ok'){
          this.setState({sentmodal: true})
        }
        else{
          this.setState({errormodal: true})
        }
      })
      .catch(error => {
        console.error(error);
      });
  }


  restartCarrier = () => {
    // e.preventDefault();
    this.setState({mainchainRestartModal: false})

    fetch('http://elabox.local:3001/restartMainchain', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pwd: this.state.pwd
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        if (responseJson.ok == 'ok'){
          this.setState({sentmodal: true})
        }
        else{
          this.setState({errormodal: true})
        }
      })
      .catch(error => {
        console.error(error);
      });
  }


  showRestartMain = () => {
    this.setState({mainchainRestartModal: true})
  }
  closeRestartMain = () => {
    this.setState({mainchainRestartModal: false})
  }
  showResyncMain = () => {
    this.setState({mainchainResyncModal: true})
  }
  closeResyncMain = () => {
    this.setState({mainchainResyncModal: false})
  }
  showRestartDid = () => {
    this.setState({didRestartModal: true})
  }
  closeRestartDid = () => {
    this.setState({didRestartModal: false})
  }
  showResyncDid = () => {
    this.setState({didResyncModal: true})
  }
  closeResyncDid = () => {
    this.setState({didResyncModal: false})
  }
  showRestartCarrier = () => {
    this.setState({carrierRestartModal: true})
  }
  closeRestartCarrier = () => {
    this.setState({carrierRestartModal: false})
  }

  render(){
    return (
      <div id='main' style={{paddingLeft:'18%', height:'100%', width:'100%', backgroundColor:'#1E1E26'}} className="animated fadeIn w3-container">

        <Modal isOpen={this.state.mainchainRestartModal}>
          <ModalHeader>Restart Mainchain</ModalHeader>
          <ModalBody>
            <center>
              Enter your wallet password to restart the mainchain<br/>
              This process will take a few minutes<br/><br/>
            </center>
            <Input type="password" id="pwd" name="pwd" placeholder="Enter ELA wallet password" required  onChange={ (e) => this.handleChange(e) }/>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.restartMainchain} >Restart</Button>
            <Button color="danger" onClick={this.closeRestartMain} >Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.mainchainResyncModal}>
          <ModalHeader>Resync Mainchain</ModalHeader>
          <ModalBody>
            <center>
              <b>PLEASE READ CAREFULY</b><br/>
              Resycing the whole mainchain will take a few days.<br /> 
              You should try to restart the node first!<br/><br/>

              Enter your wallet password to re-sync the mainchain<br/>
            </center>
            <Input type="password" id="pwd" name="pwd" placeholder="Enter ELA wallet password" required  onChange={ (e) => this.handleChange(e) }/>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.resyncMainchain} >Re-sync</Button>
            <Button color="danger" onClick={this.closeResyncMain} >Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.didRestartModal}>
          <ModalHeader>Restart DID sidechain</ModalHeader>
          <ModalBody>
            <center>
              You are about to restart the DID sidechain<br/>
              This process will take a few minutes<br/><br/>
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.restartDid} >Restart</Button>
            <Button color="danger" onClick={this.closeRestartDid} >Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.didResyncModal}>
          <ModalHeader>Resync DID sidechain</ModalHeader>
          <ModalBody>
            <center>
              <b>PLEASE READ CAREFULY</b><br/>
              Resycing the DID sidechain will take a few days.<br /> 
              You should try to restart the node first!<br/><br/>

              Click Re-sync to re-sync the DID sidechain<br/>
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.resyncDid} >Re-sync</Button>
            <Button color="danger" onClick={this.closeResyncDid} >Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.carrierRestartModal}>
          <ModalHeader>Restart Carrier</ModalHeader>
          <ModalBody>
            <center>
              You are about to restart your Carrier node<br/>
              This process will take a few minutes<br/><br/>
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.restartCarrier} >Restart</Button>
            <Button color="danger" onClick={this.closeRestartCarrier} >Cancel</Button>
          </ModalFooter>
        </Modal>

        <Row >
          <Col>
            <Card style={{backgroundColor:'#272A3D', color:'white', fontSize:'16px', marginBottom:'20px'}}>
              <CardHeader>Control your Elabox</CardHeader>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs="12" sm="6" lg="4">
          <Widget05 dataBox={() => ({ title: 'MainChain', variant: 'facebook', Restart: 'Restart', Resync: 'Re-sync'})} onGreenPress={this.showRestartMain} onRedPress={this.showResyncMain} >
            </Widget05>
          </Col>

          <Col xs="12" sm="6" lg="4">
          <Widget05 dataBox={() => ({ title: 'DID',variant: 'facebook', Restart: 'Restart', Resync: 'Re-sync'})} onGreenPress={this.showRestartDid} onRedPress={this.showResyncDid}>
            </Widget05>
          </Col>

          <Col xs="12" sm="6" lg="4">
          <Widget05 dataBox={() => ({ title: 'Carrier',variant: 'facebook', Restart: 'Relaunch', Resync: ''})} onGreenPress={this.showRestartCarrier} >
            </Widget05>
          </Col>
        </Row>

        <Row >
          <Col>
            <Card style={{backgroundColor:'#272A3D', color:'white', fontSize:'16px', marginTop:'40px'}}>
              <CardHeader>Backup your wallet file</CardHeader>
            </Card>
          </Col>
        </Row>

        <Row style={{marginTop: '20px'}}>
          <Col xs="12" sm="6" lg="4">
          <Widget05 dataBox={() => ({ title: 'Backup wallet file', variant: 'facebook', Restart: 'Download', Resync: '' })}  >
            </Widget05>
          </Col>
        </Row>

        <Row >
          <Col>
            <Card style={{backgroundColor:'#272A3D', color:'white', fontSize:'16px', marginTop:'40px'}}>
              <CardHeader>Check for updates</CardHeader>
            </Card>
          </Col>
        </Row>

        <Row style={{marginTop: '20px'}}>
          <Col xs="12" sm="6" lg="4">
          <Widget05 dataBox={() => ({ title: 'Check for updates', variant: 'facebook', Restart: 'Check', Resync: '' })} >
            </Widget05>
          </Col>
        </Row>

      </div>

    );
  }
}

export default Settings;