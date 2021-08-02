import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import { observer } from "mobx-react"
import Navbar from "./components/Navbar"
import SideBar from "./components/Sidebar"
const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
)

const Wallet = React.lazy(() => import("./Wallet"))
const Settings = React.lazy(() => import("./Settings"))
const Dashboard = React.lazy(() => import("./Dashboard"))
const HelpCentre = React.lazy(() => import("./HelpCentre"))
const Updates = React.lazy(() => import("./Updates"))

function Companion({ ota, elaStatus }) {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  // const { setAuthTokens } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const [isLoggedIn, setLoggedIn] = useState(true)
  const [isOpen, setOpen] = useState(false)
  // const [servicesRunning, setServicesRunning] = useState(true);
  // const [pwd, setPwd] = useState("");
  useEffect(() => {
    ota.handleCheckUpdates()
  }, [])
  function logOut() {
    // setAuthTokens(null)
    // localStorage.clear()
    // console.log(localStorage)
    localStorage.setItem("logedin", false)
    setLoggedIn(false)
    console.log(localStorage)
    // console.log("Logging out")
  }

  // const checkServices = () => {
  //   backend.serviceStatus().then((responseJson) => {
  //     const { elaRunning, didRunning, carrierRunning } = responseJson;
  //     console.log("checkServices elaRunning: ", elaRunning);
  //     console.log("checkServices didRunning: ", didRunning);
  //     console.log("checkServices carrierRunning: ", carrierRunning);
  //     // setServicesRunning(elaRunning && carrierRunning && didRunning)
  //     if (!didRunning) {
  //       console.log("Restarting DID");
  //       backend.restartDid();
  //     }
  //     if (!carrierRunning) {
  //       console.log("Restarting Carrier");
  //       backend.restartCarrier();
  //     }

  //     // ask for the pwd only if ela is not running
  //     setServicesRunning(elaRunning);
  //   });
  // };

  // const restartServices = () => {
  //   console.log("Restarting ela");
  //   // restart ela
  //   backend.restartMainChain(pwd).then((responseJson) => {
  //     checkServices();
  //   });
  // };
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }

  // render() {

  return (
    <>
      <Router>
        <div
          style={{
            height: "100vh",
            backgroundColor: "#1E1E26",
            paddingTop: "80px",
          }}
        >
          <Navbar logOut={logOut} onMenuClick={setOpen} />
          <SideBar
            isOpen={isOpen}
            updatesCount={ota.updatesCount}
            onClose={() => {
              setOpen(false)
            }}
          />
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route path="/help">
                <HelpCentre isMobile={isMobile} />
              </Route>
              <Route path="/wallet">
                <Wallet isMobile={isMobile} />
              </Route>
              <Route path="/settings">
                <Settings isMobile={isMobile} ota={ota} />
              </Route>
              <Route path="/updates">
                <Updates isMobile={isMobile} ota={ota} elaStatus={elaStatus} />
              </Route>
              <Route path="*">
                <Dashboard isMobile={isMobile} />
              </Route>
            </Switch>
          </React.Suspense>
        </div>
      </Router>
      {/* {
        <Modal isOpen={!servicesRunning}>
          <ModalHeader>Restart Services</ModalHeader>
          <ModalBody>
            <center>
              Your Elabox services are turned off. Enter your password to
              restart them.
              <br />
              This process will take a few minutes
              <br />
              <br />
            </center>
            <Input
              type="password"
              id="pwd"
              name="pwd"
              placeholder="Enter ELA wallet password"
              required
              autofocus
              onChange={(e) => setPwd(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={}>
              Restart
            </Button>
          </ModalFooter>
        </Modal>
      } */}
    </>
  )
  // }
}

// function SideBar() {
//   return (
//     <div className="w3-sidebar w3-bar-block w3-animate-left" id="mySidebar" style={{ width: '18%', display: 'block', backgroundColor: '#1E1E26' }}>
//       <div style={{ width: '90%', height: '90%', backgroundColor: '#2C71F6', margin: 'auto', borderRadius: 10, color: 'white' }}>
//         <ul style={{ listStyle: 'none', paddingTop: '20px', paddingLeft: '0' }}>
//           <li>
//             <div className="sidebarMenu">
//               <Link to="/dashboard" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}> <img src={dashboardLogo} style={{ widht: '30px', height: '30px', paddingRight: '10px' }} /> Dashboard</Link>
//             </div>
//           </li>
//           <li>
//             <div className="sidebarMenu">
//               <Link to="/wallet" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}> <img src={walletLogo} style={{ widht: '30px', height: '30px', paddingRight: '10px' }} />Wallet</Link>
//             </div>
//           </li>
//           <li>
//             <div className="sidebarMenu">
//               <Link to="/settings" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}> <img src={settingsLogo} style={{ widht: '30px', height: '30px', paddingRight: '10px' }} />Settings</Link>
//             </div>
//           </li>
//           <li>
//             <div className="sidebarMenu">
//               <Link to="/help" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}> <img src={settingsLogo} style={{ widht: '30px', height: '30px', paddingRight: '10px' }} />Help Center</Link>
//             </div>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }
export default observer(Companion)
