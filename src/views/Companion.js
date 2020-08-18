import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { NavLink } from "react-router-dom";
// import Wallet from './Wallet'
// import Dashboard from './Dashboard'
// import Settings from './Settings'
import { Nav, Button, Navbar, NavbarBrand, Media } from "reactstrap";
import elaboxLogo from './images/logo-wht.png'
import dashboardLogo from './images/dashboard_white.png'
import walletLogo from './images/wallet_white.png'
import settingsLogo from './images/settings_white.png'
// import { useAuth } from "./context/auth";

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const Wallet = React.lazy(() => import('./Wallet'));
const Settings = React.lazy(() => import('./Settings'));
const Dashboard = React.lazy(() => import('./Dashboard'));
const HelpCentre = React.lazy(() => import('./HelpCentre'));

function Companion() {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  // const { setAuthTokens } = useAuth();
  const [isLoggedIn, setLoggedIn] = useState(true);

  function logOut() {

    // setAuthTokens(null)
    // localStorage.clear()
    // console.log(localStorage)
    localStorage.setItem('logedin', false)
    setLoggedIn(false)
    console.log(localStorage)
    // console.log("Logging out")

  }

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  // render() {

  return (
    <Router>
      <div style={{ height: '100vh', backgroundColor: '#1E1E26', paddingTop: '80px', }}>
        <Navbar fixed='top' style={{ backgroundColor: '#1E1E26' }}>
          <img className="align-middle" src={elaboxLogo} style={{ widht: '60px', height: '60px' }}></img>
          <Button onClick={logOut} color="danger">Log out</Button>
        </Navbar>

        <SideBar />
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route path="/help">
              <HelpCentre />
            </Route>

            <Route path="/wallet">
              <Wallet />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="*" component={Dashboard} />

          </Switch>
        </React.Suspense>
      </div>
    </Router>
  );
  // }
}

function SideBar() {
  return (
    <div className="w3-sidebar w3-bar-block w3-animate-left" id="mySidebar" style={{ width: '18%', display: 'block', backgroundColor: '#1E1E26' }}>
      <div style={{ width: '90%', height: '90%', backgroundColor: '#2C71F6', margin: 'auto', borderRadius: 10, color: 'white' }}>
        <ul style={{ listStyle: 'none', paddingTop: '20px', paddingLeft: '0' }}>
          <li>
            <div className="sidebarMenu">
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}> <img src={dashboardLogo} style={{ widht: '30px', height: '30px', paddingRight: '10px' }} /> Dashboard</Link>
            </div>
          </li>
          <li>
            <div className="sidebarMenu">
              <Link to="/wallet" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}> <img src={walletLogo} style={{ widht: '30px', height: '30px', paddingRight: '10px' }} />Wallet</Link>
            </div>
          </li>
          <li>
            <div className="sidebarMenu">
              <Link to="/settings" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}> <img src={settingsLogo} style={{ widht: '30px', height: '30px', paddingRight: '10px' }} />Settings</Link>
            </div>
          </li>
          <li>
            <div className="sidebarMenu">
              <Link to="/help" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}> <img src={settingsLogo} style={{ widht: '30px', height: '30px', paddingRight: '10px' }} />Help Center</Link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Companion;