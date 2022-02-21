import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  ModalHeader,
  Form,
  FormGroup,
  Label,
  FormFeedback,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
  ButtonGroup  
} from "reactstrap";
import {IoMdRemoveCircle} from "react-icons/io"
import Widget05 from "./widgets/Widget05";

import master from "../api/master";
import backend from "../api/backend";
import { validCharacters } from "../utils/auth"
import RootStore from "../store";
import errorLogo from "./images/error.png";
import checkLogo from "./images/check.png";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.uploadKeyStoreRef = React.createRef();
    this.state = {
      pwd: "",
      mainchainRestartModal: false,
      mainchainResyncModal: false,
      eidRestartModal: false,
      eidResyncModal: false,
      uploadKeyStoreConsentModal:false,
      uploadKeyStoreModal:false,
      uploadKeyStoreProcessing:false,
      uploadKeyStoreSteps : 1,
      uploadKeyStoreStatus:{status:"",message:""},      
      carrierRestartModal: false,
      update: false,
      checkUpdateModal: false,
      networkErrorModal: false,
      updateNowModal: false,
      errorUpdateModal: false,
      dlKeystoreState: 0,
      version: "",
      mainchainVersion:"",
      eidVersion:"",
      escVersion:"",
      feedsVersion:"",
      carrierVersion:"",
      onion: "",
      env: "",
      showOnion: false,
      errormodal: false,
      resyncsuccessmodal: false,
      form:{
        values:{
          keystoreFileRaw:"",
          keystore:"",
          oldPass:"",
          newPass:"",
        },
        messages:{
          keystore:"",
          oldPass:"",
          newPass:"",
        }
      }
    };
  }

  componentWillMount() {
    this.getVersion();
    this.getOnion();
  }

  verifyPassword = () => {
    // e.preventDefault();
    this.setState({ resyncModal: false });

    backend
      .resyncNodeVerification(this.state.pwd)
      .then((responseJson) => {
        console.log("RESYNC RESPONSE JSON: ");
        console.log(responseJson);
        if (responseJson.ok) {
          this.setState({ resyncsuccessmodal: true });
          this.resyncNode(this.state.node);
        } else {
          this.setState({ errormodal: true });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [name]: value,
    });
  };
  resyncNode = (node) => {
    this.setState({ resyncModal: false });

    node
      .resync()
      .then((responseJson) => {
        node.fetchData();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  restartNode = (node) => {
    // e.preventDefault();
    this.setState({ restartModal: false });

    node
      .restart()
      .then((responseJson) => {
        if (responseJson.success) {
          // RootStore.blockchain.ela.fetchData();
        } else {
          node.fetchData();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  showRestart = (label = "node", node) => {
    this.setState({ restartModal: true, nodeLabel: label, node: node });
  };
  closeRestart = () => {
    this.setState({ restartModal: false });
  };
  showResync = (label = "node", node) => {
    this.setState({ resyncModal: true, nodeLabel: label, node: node });
  };
  closeResync = () => {
    this.setState({ resyncModal: false });
  };

  errortoggle = () => {
    this.setState({ errormodal: false });
  };

  resyncsuccesstoggle = () => {
    this.setState({ resyncsuccessmodal: false });
  };

  checkUpdate = async () => {
    try {
      const data = await master.checkUpdate();
      this.setState({ checkUpdateModal: true, update: data.available });
    } catch (error) {
      console.error(error);
      this.setState({ networkErrorModal: true });
    }
  };
  closeCheckUpdateModal = () => {
    this.setState({
      checkUpdateModal: false,
    });
  };

  closeNetworkErrorModal = () => {
    this.setState({
      networkErrorModal: false,
    });
  };

  openUpdateNowModal = () => {
    this.setState({
      updateNowModal: true,
    });
  };

  closeUpdateNowModal = () => {
    this.setState({
      updateNowModal: false,
    });
  };

  openErrorUpdateModal = () => {
    this.setState({
      errorUpdateModal: true,
    });
  };

  closeErrorUpdateModal = () => {
    this.setState({
      errorUpdateModal: false,
    });
  };
  closeDlKeyStoreModal=()=>{
    this.setState({
      dlKeystoreState:0
    })
  }
  setDlKeystoreState = () => {
    if (this.state.dlKeystoreState === 1) { 
      this.setState({ dlKeystoreState: 2 });
      backend.downloadWallet(this.state.pwd)
        .then((_) => {
          this.setState({ dlKeystoreState: 0, pwd:"" });
        })
        .catch((error) => {
          this.setState({ dlKeystoreState: 3, pwd:"" });
        });
    } else if (this.state.dlKeystoreState === 0)
      this.setState({ dlKeystoreState: 1 ,pwd:""});
    else {
      this.setState({ dlKeystoreState: 0 , pwd:""});
    }
  }

  updateNow = async () => {
    this.closeUpdateNowModal();
    try {
      const data = await master.updateNow();
      setTimeout(() => {
        window.open(`http://${window.location.hostname}`);
      }, 5000);
    } catch (error) {
      this.openErrorUpdateModal();
    }
  };

  getVersion = () => {
    backend.getVersionDetails("current").then((response) => {
      //console.log(response)
      this.setState(
        {
          elaboxVersion: response.version,
          env: response.env,
          mainchainVersion:response.mainchainVersion,
          eidVersion: response.eidVersion,
          escVersion: response.escVersion,
          feedsVersion: response.feedsVersion,
          carrierVersion: response.carrierVersion,
        },
        () => {
          //console.log("state", this.state)
        }
      );
    });
  };

  getOnion = () => {
    backend.getOnion().then((response) => {
      this.setState({ onion: response.data.onion });
    });
  };

  regenerateOnion = () => {
    backend.regenerateOnion().then((response) => {
      this.setState({ onion: response.data.onion });
    });
  };

  toggleOnion = () => {
    this.setState({ showOnion: !this.state.showOnion });
    console.log("toggleOnion");
  };
  showUploadKeyStoreModal = ()=>{
    this.setState({uploadKeyStoreModal:true,uploadKeyStoreConsentModal:false})
  }
  closeUploadKeyStoreModal = ()=>{
    this.setState({uploadKeyStoreModal:false},()=>{
      setTimeout(()=>{
        this.setState({
          uploadKeyStoreSteps:1,
          uploadKeyStoreStatus:{status:"",message:""},
          form:{
          values:{
            keystoreFileRaw:"",            
            keystore:"",
            oldPass:"",
            newPass:"",
          },
          messages:{
            keystore:"",
            oldPass:"",
            newPass:"",
          }
        }        
        })              
      },2000)
    })
  }
  handleInputChange = async (id,value)=>{
    switch (id) {
      case "keystore":
        const keyStoreValue = await value.text()
        this.setState({ form:{
          ...this.state.form,
          values:{
            ...this.state.form.values,
            keystore: new Buffer(keyStoreValue).toString('hex')
          },
          messages:{
            ...this.state.form.messages,
            keystore:""
          }
        }})        
        break;
      default:
        this.setState({ form:{
          ...this.state.form,
          values:{
            ...this.state.form.values,
            [id]: value
          }
        }})            
        break;
    }
  }
  validateUploadKeystoreForm = (idtoBeValidated="") => new Promise((resolve,reject)=>{
    Object.keys(this.state.form.values).filter(id=>{
      if(idtoBeValidated.length>0){
        return id === idtoBeValidated
      }
      return id !== "keystoreFileRaw";
    }).forEach((id)=>{
      const value=this.state.form.values[id];
      console.log(id,value)
      if(value.length === 0){
        this.setState(prevState=>({form:{
          ...prevState.form,
          messages:{
            ...prevState.form.messages,
            [id]:"This field is required."
          }
        }}))        
      }
      else if(!validCharacters(value) && (id!=="keystore" && id !== "oldPass")){
        this.setState(prevState=>({form:{
          ...prevState.form,
          messages:{
            ...prevState.form.messages,
            [id]:"Password shouldnt contain special characters and space with atleast 6 characters."
          }
        }}))        
      }    
      else{
        this.setState(prevState=>({form:{
          ...prevState.form,
          messages:{
            ...prevState.form.messages,
            [id]:""
          }
        }}))
      }    
    })
    resolve(true)
  })
  handleSubmitKeyStore=()=>{
    this.validateUploadKeystoreForm().then(()=>{
      const {messages,values} = this.state.form
      const isValid = messages.keystore.length===0 && messages.oldPass.length ===0  && messages.newPass.length === 0
      if(isValid){
        this.setState({uploadKeyStoreProcessing:true});
        backend.uploadKeyStore(values).then(response=>{
          const {ok}=response;
          if(ok==="nope"){
            this.setState({uploadKeyStoreProcessing:false,uploadKeyStoreStatus:{status:"error",message:response.err}})
          }
          else{
            backend
            .login(values.newPass)
            .then(async (response) => {
              const responseJson=await response.json()
              if (responseJson.ok) {
                localStorage.setItem('address', responseJson.address);            
              }
            })
            .finally(()=>{
              this.setState({uploadKeyStoreProcessing:false,uploadKeyStoreStatus:{status:"success",message:""}});                    
            })
          }
        })
        .catch( err => {
          console.error(err)
          this.setState({uploadKeyStoreProcessing:false,uploadKeyStoreStatus:{status:"error",message:"Invalid keystore file."}});    
        })
      }
    })
  }
  handleUploadKeyStoreStatus=status=>{
    this.setState({uploadKeyStoreStatus:{status,message:""}})
  }
  handleUploadKeyStoreStepsPrev=()=>{
    this.setState(prevState=>({uploadKeyStoreSteps:prevState.uploadKeyStoreSteps-1}))
  }
  handleUploadKeyStoreStepsNext=()=>{
    this.validateUploadKeystoreForm("oldPass").then(()=>{
      const {messages}=this.state.form
      const isValid =  messages.oldPass.length ===0 
      if(isValid){
        this.setState(prevState=>({uploadKeyStoreSteps:prevState.uploadKeyStoreSteps+1}))
      }    
    })
  }  
  handleShowUploadConsentModal = () =>{
    this.setState({uploadKeyStoreConsentModal:true})    
  }
  handleHideUploadConsentModal = () =>{
    this.setState({uploadKeyStoreConsentModal:false})    
  }  
  render() {
    const { isMobile } = this.props;

    const {
      update,
      checkUpdateModal,
      networkErrorModal,
      updateNowModal,
      errorUpdateModal,
      dlKeystoreState,
      onion,
      showOnion,
      elaboxVersion,
      mainchainVersion,
      eidVersion,
      escVersion,
      feedsVersion,
      carrierVersion,
      env,
    } = this.state;
    console.log("render", showOnion);
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
          <ModalHeader> Restart {this.state.nodeLabel}</ModalHeader>
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
        <Modal isOpen={this.state.uploadKeyStoreModal}>
          <ModalHeader toggle={this.closeUploadKeyStoreModal}>Upload keystore</ModalHeader>
          <ModalBody>
            {this.state.uploadKeyStoreStatus.status === "success" || this.state.uploadKeyStoreStatus.status === "error" ?
              <center>
                <img src={ this.state.uploadKeyStoreStatus.status==="success" ? checkLogo : errorLogo} style={{ width: "50px", height: "50px" }} />                
                <br />
                <br />                
                {this.state.uploadKeyStoreStatus.status==="success" ? "Keystore uploaded." : this.state.uploadKeyStoreStatus.message}
              </center>            
            : <center>
              You are about to upload new keystore
              <br/>
            </center>}             
            <Form onSubmit={e=>e.preventDefault()}>
              {this.state.uploadKeyStoreSteps === 1 && this.state.uploadKeyStoreStatus.status ==="" && <>
                <FormGroup>
              <Label for="old_password">
                Confirm Password
              </Label>
              <Input id="old_password" name="old_password" type="password" invalid={this.state.form.messages.oldPass.length>0} value={this.state.form.values.oldPass.length > 0 ? this.state.form.values.oldPass:""} onChange={e=>{
                this.handleInputChange("oldPass",e.target.value.trim())
              }} />
              <FormFeedback>
                {this.state.form.messages.oldPass}
              </FormFeedback>              
            </FormGroup>                      
              </>}           
            {this.state.uploadKeyStoreSteps === 2 && this.state.uploadKeyStoreStatus.status==="" && <>
              <FormGroup disabled={this.state.uploadKeyStoreProcessing}>                 
                  <Input style={{visibility:"hidden"}} id="new_keystore" name="new_keystore" type="file" innerRef={this.uploadKeyStoreRef} invalid={this.state.form.messages.keystore.length>0} onChange={e=>{
                    const file = e.target.files[0]
                    this.setState(prevState=>({
                      form: {
                        ...prevState.form,
                        values:{
                          ...prevState.form.values,
                          keystoreFileRaw: file
                        }
                      }
                    }))
                    this.handleInputChange("keystore",file)
                  }}/>
                  <ButtonGroup style={{width:"100%"}}>
                  <Button style={{width:"90%",pointerEvents: this.state.form.values.keystore.length > 0 ? "none":"initial",color:"white",border: this.state.form.values.keystore.length > 0 ?"5px solid #04AA6D":"initial"}} color={`${this.state.form.values.keystore.length>0 ? "":"secondary"}`} disabled={this.state.uploadKeyStoreProcessing} onClick={()=>{
                      this.uploadKeyStoreRef.current.click()
                  }}>
                    {this.state.form.values.keystore.length>0 ? `${this.state.form.values.keystoreFileRaw?.name} is uploaded`:"Upload Keystore"}
                  </Button>     
                  {this.state.form.values.keystore.length>0 && <Button color="danger" onClick={()=>{
                      this.uploadKeyStoreRef.current.value=""
                      this.setState(prevState=>({
                        form:{
                          ...prevState.form,
                          values:{
                            ...prevState.form.values,
                            keystore:"",
                            keystoreFileRaw:""
                          }
                        }
                      }))                    
                  }}><IoMdRemoveCircle/>
                  </Button> }
                  </ButtonGroup>             
                  <FormFeedback>
                    {this.state.form.messages.keystore}
                  </FormFeedback>              
               </FormGroup>               
               <FormGroup disabled={this.state.uploadKeyStoreProcessing}>
              <Label for="new_password">
                Verify keystore password
              </Label>
              <Input id="new_password" name="new_password" type="password" invalid={this.state.form.messages.newPass.length>0} value={this.state.form.values.newPass.length > 0 ? this.state.form.values.newPass:""} onChange={e=>{
                this.handleInputChange("newPass",e.target.value.trim())
              }} />
              <FormFeedback>
                {this.state.form.messages.newPass}
              </FormFeedback>                            
            </FormGroup>                
            </>}     
            </Form>
          </ModalBody>
          <ModalFooter>
            {this.state.uploadKeyStoreSteps > 1 && this.state.uploadKeyStoreStatus.status === "" && !this.state.uploadKeyStoreProcessing  && <Button data-testid="upload-keystore-prev-btn" onClick={this.handleUploadKeyStoreStepsPrev}>
              Previous
            </Button>}            
            {this.state.uploadKeyStoreSteps < 2 ? <>                        
            <Button data-testid="upload-keystore-next-btn" color="success" onClick={this.handleUploadKeyStoreStepsNext}>
              Next
            </Button>            
            </>:<>
            {this.state.uploadKeyStoreStatus.status==="" ? <>
              <Button
                data-testid="upload-keystore-btn"
                color="success"
                onClick={this.handleSubmitKeyStore}
                disabled={this.state.uploadKeyStoreProcessing}
              >
                {this.state.uploadKeyStoreProcessing ? <Spinner size="sm">Loading...</Spinner>:"Confirm"}
              </Button>
            </>:<>
            <Button color={this.state.uploadKeyStoreStatus.status==="success" ? "success":"danger"} onClick={this.closeUploadKeyStoreModal}>
              Ok
            </Button>            
            </> }            
            </>}
          </ModalFooter>
        </Modal>       
        <Modal isOpen={this.state.uploadKeyStoreConsentModal}>
          <ModalHeader>Warning</ModalHeader>
          <ModalBody>
            <center>
              <p>Uploading new keystore will update your keystore and device password.</p>
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleHideUploadConsentModal}>
              No
            </Button>                        
            <Button color="success" onClick={this.showUploadKeyStoreModal}>
              I understand
            </Button>
          </ModalFooter>
        </Modal>         
        <Modal isOpen={this.state.errormodal}>
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
            <Button color="primary" onClick={this.errortoggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.resyncsuccessmodal}>
          <ModalHeader>Success</ModalHeader>
          <ModalBody>
            <center>
              Resyncing Node <br />
              <br />
              <img src={checkLogo} style={{ width: "50px", height: "50px" }} />
            </center>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.resyncsuccesstoggle}>
              Close
            </Button>
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
        <Modal isOpen={dlKeystoreState !== 0}>
          <ModalHeader>Download Keystore</ModalHeader>
          <ModalBody>
            {dlKeystoreState === 3 && <center>
              Password is incorrect
            </center>}
            {dlKeystoreState === 2 && <center>
              Please wait...
            </center>}
            {dlKeystoreState === 1 && <Input
              type="password"
              id="pwd"
              name="pwd"
              placeholder="Password"
              required
              onChange={(e) => this.handleChange(e)}
            />}
          </ModalBody>
          {(dlKeystoreState === 1 || dlKeystoreState === 3) && <ModalFooter>
            <Button color="success" onClick={this.setDlKeystoreState}>
              OK
            </Button>            
            {dlKeystoreState === 1 &&  <Button color="danger" onClick={this.closeDlKeyStoreModal}>
              Cancel
            </Button>}
          </ModalFooter>}
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
                version: mainchainVersion,                
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
                version: eidVersion,                                
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
                version: escVersion,                                                
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
                version: feedsVersion,                                                
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
                version: carrierVersion,                                                
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
              testid="keystore-upload-btn"
              dataBox={() => ({
                title: "Upload keystore",
                variant: "facebook",
                Restart: "Upload",
                Resync: "",
              })}
              onGreenPress={this.handleShowUploadConsentModal}
            ></Widget05>
          </Col>          
          <Col xs="12" sm="6" lg="4">
            <Widget05
              testid="download-wallet-btn"
              dataBox={() => ({
                title: "Backup wallet file",
                variant: "facebook",
                Restart: "Download",
                Resync: "",
              })}
              onGreenPress={this.setDlKeystoreState}
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
    );
  }
}
export default Settings;
