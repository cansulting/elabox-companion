import React, { Component } from "react"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  ModalHeader,
  Card,
  CardBody,
  CardHeader,
  Col,

  Row,
} from "reactstrap"
import Widget05 from "./widgets/Widget05"

import master from "../api/master"
import backend from "../api/backend"
import RootStore from "../store"
import errorLogo from './images/error.png'
import checkLogo from './images/check.png'


class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pwd: "",
      mainchainRestartModal: false,
      mainchainResyncModal: false,
      eidRestartModal: false,
      eidResyncModal: false,
      carrierRestartModal: false,
      update: false,
      checkUpdateModal: false,
      networkErrorModal: false,
      updateNowModal: false,
      errorUpdateModal: false,
      version: "",
      onion: "",
      env: "",
      showOnion: false,
      errormodal: false,
      resyncsuccessmodal: false,
    }
  }

  componentWillMount() {
    this.getVersion()
    this.getOnion()
  }


  verifyPassword = () => {
    // e.preventDefault();
    this.setState({ resyncModal: false })


    backend.resyncNodeVerification(this.state.pwd)
      .then(responseJson => {
        console.log("RESYNC RESPONSE JSON: ")
        console.log(responseJson)
        if (responseJson.ok) {
          this.setState({ resyncsuccessmodal: true })
          this.resyncNode(this.state.node)


        }
        else {
          this.setState({ errormodal: true })

        }
      })
      .catch(error => {
        console.error(error);
      });
  }




  handleChange = async (event) => {
    const { target } = event
    const value = target.type === "checkbox" ? target.checked : target.value
    const { name } = target
    await this.setState({
      [name]: value,
    })
  }
  resyncNode = (node) => {
    this.setState({ resyncModal: false })

    node
      .resync()
      .then((responseJson) => {
        node.fetchData()
      })
      .catch((error) => {
        console.error(error)
      })
  }
  restartNode = (node) => {
    // e.preventDefault();
    this.setState({ restartModal: false })

    node
      .restart()
      .then((responseJson) => {
        if (responseJson.success) {
          // RootStore.blockchain.ela.fetchData();
        } else {
          node.fetchData()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  showRestart = (label = "node", node) => {
    this.setState({ restartModal: true, nodeLabel: label, node: node })
  }
  closeRestart = () => {
    this.setState({ restartModal: false })
  }
  showResync = (label = "node", node) => {
    this.setState({ resyncModal: true, nodeLabel: label, node: node })
  }
  closeResync = () => {
    this.setState({ resyncModal: false })
  }

  errortoggle = () => {
    this.setState({ errormodal: false })
  }

  resyncsuccesstoggle = () => {
    this.setState({ resyncsuccessmodal: false })
  }

  checkUpdate = async () => {
    try {
      const data = await master.checkUpdate()
      this.setState({ checkUpdateModal: true, update: data.available })
    } catch (error) {
      console.error(error)
      this.setState({ networkErrorModal: true })
    }
  }
  closeCheckUpdateModal = () => {
    this.setState({
      checkUpdateModal: false,
    })
  }

  closeNetworkErrorModal = () => {
    this.setState({
      networkErrorModal: false,
    })
  }

  openUpdateNowModal = () => {
    this.setState({
      updateNowModal: true,
    })
  }

  closeUpdateNowModal = () => {
    this.setState({
      updateNowModal: false,
    })
  }

  openErrorUpdateModal = () => {
    this.setState({
      errorUpdateModal: true,
    })
  }

  closeErrorUpdateModal = () => {
    this.setState({
      errorUpdateModal: false,
    })
  }

  updateNow = async () => {
    this.closeUpdateNowModal()
    try {
      // const data = await master.updateNow()
      setTimeout(() => {
        window.open(`http://${window.location.hostname}`)
      }, 5000)
    } catch (error) {
      this.openErrorUpdateModal()
    }
  }

  getVersion = () => {
    backend.getVersionDetails().then((response) => {
      //console.log(response)
      this.setState(
        { elaboxVersion: response.version, env: response.env },
        () => {
          //console.log("state", this.state)
        }
      )
    })
  }

  getOnion = () => {
    backend.getOnion().then((response) => {
      this.setState({ onion: response.data.onion })
    })
  }

  regenerateOnion = () => {
    backend.regenerateOnion().then((response) => {
      this.setState({ onion: response.data.onion })
    })
  }

  toggleOnion = () => {
    this.setState({ showOnion: !this.state.showOnion })
    console.log("toggleOnion")
  }

  render() {
    const { isMobile } = this.props

    const {
      update,
      checkUpdateModal,
      networkErrorModal,
      updateNowModal,
      errorUpdateModal,
      onion,
      showOnion,
      elaboxVersion,
      env,
    } = this.state
    console.log("render", showOnion)
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
        <Modal isOpen={this.state.restartModal}>
          <ModalHeader>Restart {this.state.nodeLabel}</ModalHeader>
          <ModalBody>
            <center>
              You are about to restart the {this.state.nodeLabel}
              <br />
              This process will take a few hours
              <br />
              <br />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button
              data-testid="restart-btn"
              color="success"
              onClick={() => this.restartNode(this.state.node)}
            >
              Restart
            </Button>
            <Button color="danger" onClick={this.closeRestart}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.errormodal}>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <center>
              Invalid password, please try again<br /><br />
              <img src={errorLogo} style={{ width: '50px', height: '50px' }} />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.errortoggle} >Close</Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.resyncsuccessmodal}>
          <ModalHeader>Success</ModalHeader>
          <ModalBody>
            <center>
              Resyncing Node <br /><br />
              <img src={checkLogo} style={{ width: '50px', height: '50px' }} />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.resyncsuccesstoggle} >Close</Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.resyncModal}>
          <ModalHeader>Resync {this.state.nodeLabel}</ModalHeader>
          <ModalBody>
            <center>
              <b>PLEASE READ CAREFULY</b>
              <br />
              Resycing the will take a few days.
              <br />
              You should try to restart the node first!
              <br />
              <br />
              Enter your wallet password to re-sync the {this.state.nodeLabel}
              <br />
            </center>
            <Input
              type="password"
              id="pwd"
              name="pwd"
              placeholder="Enter ELA wallet password"
              required
              onChange={(e) => this.handleChange(e)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              data-testid="resync-btn"
              color="success"
              onClick={this.verifyPassword}
            >
              Re-sync
            </Button>
            <Button color="danger" onClick={this.closeResync}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={checkUpdateModal}>
          <ModalHeader>Update Elabox</ModalHeader>
          <ModalBody>
            {update ? (
              <center>A firmware update is available for the Elabox!</center>
            ) : (
              <center>
                You are currently using the latest Elabox firmware!
              </center>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.closeCheckUpdateModal}>
              OK
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={networkErrorModal}>
          <ModalHeader>Network Error</ModalHeader>
          <ModalBody>
            <center>
              There was a Network Error please check your internet connection
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.closeNetworkErrorModal}>
              OK
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={errorUpdateModal}>
          <ModalHeader>Network Error</ModalHeader>
          <ModalBody>
            <center>
              There was a Network Error please check your internet connection
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.closeErrorUpdateModal}>
              OK
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={updateNowModal}>
          <ModalHeader>Update Elabox</ModalHeader>
          <ModalBody>
            <center>
              <b>PLEASE READ CAREFULY</b>
              <br />
              Installing the new updates can take up to 30 minutes
              <br />
              Do not turn off the Elabox
              <br />
              <br />
              Click Update Now to update the Elabox
              <br />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.updateNow}>
              Update Now
            </Button>
            <Button color="danger" onClick={this.closeUpdateNowModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col>
            <Card
              style={{
                backgroundColor: "#272A3D",
                color: "white",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            >
              <CardHeader>Control your Elabox</CardHeader>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs="12" sm="6" lg="4">
            <Widget05
              testid="ela-btn"            
              dataBox={() => ({
                title: "MainChain",
                variant: "facebook",
                Restart: "Restart",
                Resync: "Re-sync",
              })}
              onGreenPress={() =>
                this.showRestart("ELA", RootStore.blockchain.ela)
              }
              onRedPress={() =>
                this.showResync("ELA", RootStore.blockchain.ela)
              }
            ></Widget05>
          </Col>

          <Col xs="12" sm="6" lg="4">
            <Widget05
              testid="eid-btn"            
              dataBox={() => ({
                title: "EID",
                variant: "facebook",
                Restart: "Restart",
                Resync: "Re-sync",
              })}
              onGreenPress={() =>
                this.showRestart("EID", RootStore.blockchain.eid)
              }
              onRedPress={() =>
                this.showResync("EID", RootStore.blockchain.eid)
              }
            ></Widget05>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Widget05
              testid="esc-btn"            
              dataBox={() => ({
                title: "ESC",
                variant: "facebook",
                Restart: "Restart",
                Resync: "Re-sync",
              })}
              onGreenPress={() =>
                this.showRestart("ESC", RootStore.blockchain.esc)
              }
              onRedPress={() =>
                this.showResync("ESC", RootStore.blockchain.esc)
              }
            ></Widget05>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Widget05
              testid="feeds-btn"
              dataBox={() => ({
                title: "Feeds",
                variant: "facebook",
                Restart: "Relaunch",
                Resync: "",
              })}
              onGreenPress={() =>
                this.showRestart("Feeds", RootStore.blockchain.feeds)
              }
            ></Widget05>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Widget05
              testid="carrier-btn"
              dataBox={() => ({
                title: "Carrier",
                variant: "facebook",
                Restart: "Relaunch",
                Resync: "",
              })}
              onGreenPress={() =>
                this.showRestart("Carrier", RootStore.blockchain.carrier)
              }
            ></Widget05>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card
              style={{
                backgroundColor: "#272A3D",
                color: "white",
                fontSize: "16px",
                marginTop: "40px",
              }}
            >
              <CardHeader>Backup your wallet file</CardHeader>
              <CardBody>
                You can download your wallet file at any time.
                <br />
                The <b>keystore.dat</b> wallet file is the only way to recover
                your fund in case of problems.
                <br />
                For better security keep your <b>keystore.dat</b> file on a USB
                stick not connected to a computer
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: "20px" }}>
          <Col xs="12" sm="6" lg="4">
            <Widget05
              testid="download-wallet-btn"
              dataBox={() => ({
                title: "Backup wallet file",
                variant: "facebook",
                Restart: "Download",
                Resync: "",
              })}
              onGreenPress={backend.downloadWallet}
            ></Widget05>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card
              style={{
                backgroundColor: "#272A3D",
                color: "white",
                fontSize: "16px",
                marginTop: "40px",
              }}
            >
              <CardHeader>Elabox Version</CardHeader>
              <CardBody>
                <b>
                  Elabox {elaboxVersion} {env}
                </b>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card
              style={{
                backgroundColor: "#272A3D",
                color: "white",
                fontSize: "16px",
                marginTop: "40px",
              }}
            >
              <CardHeader>Your onion address</CardHeader>
              <CardBody>
                You can access your Elabox from the outside using TOR browser.
                <br />
                <b>Never share your onion address with anyone.</b>
                <br />
                <br />
                {showOnion && <p data-testid="onion-p">{onion}</p>}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col xs="12" sm="6" lg="4">
            <Widget05
              testid="show-onion-btn"
              dataBox={() => ({
                title: "Onion Address",
                variant: "facebook",
                Restart: showOnion ? "Hide" : "Show",
                Resync: "Regenerate",
              })}
              onGreenPress={this.toggleOnion}
              onRedPress={this.regenerateOnion}
            ></Widget05>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Settings
