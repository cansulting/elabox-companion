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

  useEffect(() => {
    ota.handleCheckUpdates()
  }, [])
  function logOut() {
    localStorage.setItem("logedin", false)
    localStorage.removeItem("token")     
    setLoggedIn(false)
    console.log(localStorage)
    // console.log("Logging out")
  }

  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }

  // render() {

  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
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
    </>
  )
}

export default observer(Companion)
