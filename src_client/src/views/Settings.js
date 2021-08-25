import React, { Component } from "react"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  ModalHeader,
  Badge,
  Line,
  Card,
  CardBody,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap"
import Widget05 from "./widgets/Widget05"

import master from "../api/master"
import backend from "../api/backend"
import RootStore from "../store"
class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pwd: "",
      mainchainRestartModal: false,
      mainchainResyncModal: false,
      didRestartModal: false,
      didResyncModal: false,
      carrierRestartModal: false,
      update: false,
      checkUpdateModal: false,
      networkErrorModal: false,
      updateNowModal: false,
      errorUpdateModal: false,
      version: "",
      onion: "",
      showOnion: false,
    }
  }

  componentWillMount() {
    // this.getVersion();
    this.getOnion()
  }

  handleChange = async (event) => {
    const { target } = event
    const value = target.type === "checkbox" ? target.checked : target.value
    const { name } = target
    await this.setState({
      [name]: value,
    })
  }

  restartMainchain = () => {
    // e.preventDefault();
    this.setState({ mainchainRestartModal: false })

    backend
      .restartMainChain()
      .then((responseJson) => {
        if (responseJson.success) {
          // RootStore.blockchain.ela.fetchData();
        } else {
          RootStore.blockchain.ela.fetchData()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  restartDid = () => {
    // e.preventDefault();
    this.setState({ didRestartModal: false })

    backend
      .restartDid()
      .then((responseJson) => {
        if (responseJson.success) {
          RootStore.blockchain.did.fetchData()
        } else {
          // TODO : notify error with some modal
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  resyncDid = () => {
    // e.preventDefault();
    this.setState({ didResyncModal: false })

    backend
      .resyncDid()
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.ok == "ok") {
          this.setState({ sentmodal: true })
        } else {
          this.setState({ errormodal: true })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  restartCarrier = () => {
    // e.preventDefault();
    this.setState({ carrierRestartModal: false })

    backend
      .restartCarrier()
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.ok == "ok") {
          this.setState({ sentmodal: true })
        } else {
          this.setState({ errormodal: true })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  showRestartMain = () => {
    this.setState({ mainchainRestartModal: true })
  }
  closeRestartMain = () => {
    this.setState({ mainchainRestartModal: false })
  }
  showResyncMain = () => {
    this.setState({ mainchainResyncModal: true })
  }
  closeResyncMain = () => {
    this.setState({ mainchainResyncModal: false })
  }
  showRestartDid = () => {
    this.setState({ didRestartModal: true })
  }
  closeRestartDid = () => {
    this.setState({ didRestartModal: false })
  }
  showResyncDid = () => {
    this.setState({ didResyncModal: true })
  }
  closeResyncDid = () => {
    this.setState({ didResyncModal: false })
  }
  showRestartCarrier = () => {
    this.setState({ carrierRestartModal: true })
  }
  closeRestartCarrier = () => {
    this.setState({ carrierRestartModal: false })
  }

  // checkUpdate = async () => {
  //   const data = await master.checkUpdate();
  // };

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
      const data = await master.updateNow()
      setTimeout(() => {
        window.open(`http://${window.location.hostname}`)
      }, 5000)
    } catch (error) {
      this.openErrorUpdateModal()
    }
  }

  getVersion = () => {
    master.getVersion().then((response) => {
      this.setState({ ...response.data }, () => {
        console.log("state", this.state)
      })
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
      companionVersion,
      binariesVersion,
      masterVersion,
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
        <Modal isOpen={this.state.mainchainRestartModal}>
          <ModalHeader>Restart Mainchain</ModalHeader>
          <ModalBody>
            <center>
              You are about to restart the Mainchain
              <br />
              This process will take a few hours
              <br />
              <br />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.restartMainchain}>
              Restart
            </Button>
            <Button color="danger" onClick={this.closeRestartMain}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.mainchainResyncModal}>
          <ModalHeader>Resync Mainchain</ModalHeader>
          <ModalBody>
            <center>
              <b>PLEASE READ CAREFULY</b>
              <br />
              Resycing the whole mainchain will take a few days.
              <br />
              You should try to restart the node first!
              <br />
              <br />
              Enter your wallet password to re-sync the mainchain
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
            <Button color="success" onClick={this.resyncMainchain}>
              Re-sync
            </Button>
            <Button color="danger" onClick={this.closeResyncMain}>
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

        <Modal isOpen={this.state.didRestartModal}>
          <ModalHeader>Restart DID sidechain</ModalHeader>
          <ModalBody>
            <center>
              You are about to restart the DID sidechain
              <br />
              This process will take a few minutes
              <br />
              <br />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.restartDid}>
              Restart
            </Button>
            <Button color="danger" onClick={this.closeRestartDid}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.didResyncModal}>
          <ModalHeader>Resync DID sidechain</ModalHeader>
          <ModalBody>
            <center>
              <b>PLEASE READ CAREFULY</b>
              <br />
              Resycing the DID sidechain will take a few days.
              <br />
              You should try to restart the node first!
              <br />
              <br />
              Click Re-sync to re-sync the DID sidechain
              <br />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.resyncDid}>
              Re-sync
            </Button>
            <Button color="danger" onClick={this.closeResyncDid}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.carrierRestartModal}>
          <ModalHeader>Restart Carrier</ModalHeader>
          <ModalBody>
            <center>
              You are about to restart your Carrier node
              <br />
              This process will take a few minutes
              <br />
              <br />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.restartCarrier}>
              Restart
            </Button>
            <Button color="danger" onClick={this.closeRestartCarrier}>
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
              dataBox={() => ({
                title: "MainChain",
                variant: "facebook",
                Restart: "Restart",
                Resync: "Re-sync",
              })}
              onGreenPress={this.showRestartMain}
              onRedPress={this.showResyncMain}
            ></Widget05>
          </Col>

          {/*<Col xs="12" sm="6" lg="4">
            <Widget05
              dataBox={() => ({
                title: "DID",
                variant: "facebook",
                Restart: "Restart",
                Resync: "Re-sync",
              })}
              onGreenPress={this.showRestartDid}
              onRedPress={this.showResyncDid}
            ></Widget05>
          </Col>*/}

          <Col xs="12" sm="6" lg="4">
            <Widget05
              dataBox={() => ({
                title: "Carrier",
                variant: "facebook",
                Restart: "Relaunch",
                Resync: "",
              })}
              onGreenPress={this.showRestartCarrier}
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
              <CardHeader>Check for updates</CardHeader>
              <CardBody>
                You are currently running: <br />
                <ul style={{ listStyleType: "none" }}>
                  <li>
                    Elabox <b>v {masterVersion}</b>
                  </li>
                  <li>
                    Elabox App <b>v {companionVersion}</b>
                  </li>
                  <li>
                    Elastos Node <b>v {binariesVersion}</b>
                  </li>
                </ul>
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
                {showOnion && onion}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col xs="12" sm="6" lg="4">
            <Widget05
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
