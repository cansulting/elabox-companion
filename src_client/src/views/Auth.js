import React, { useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import Ota from "./components/Ota"
const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
)
const Companion = React.lazy(() => import("./Companion"))
const Landing = React.lazy(() => import("./Landing"))
const Login = React.lazy(() => import("./Login"))

function Auth({ ota }) {
  // useEffect(() => {
  //   // Your code here
  //   fetch("http://elabox.local:3001/checkInstallation")
  //       .then(response => response.json())
  //       .then(responseJson => {
  //         localStorage.setItem('isconfiged', responseJson.stdout.trim())
  //         console.log("hhhhh")
  //         return (
  //           <Redirect
  //             to={{
  //               pathname: "/config1"
  //             }}
  //           />
  //         )
  //       })
  // }, []);

  return (
    <Router>
      <div>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/">
              {ota.isUpdating ? <Landing ota={ota} /> : <Companion ota={ota} />}
            </PrivateRoute>
          </Switch>
        </React.Suspense>
      </div>
    </Router>
  )
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  const isAuth = localStorage.getItem("logedin")
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth == "true" ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}
const AuthWithOta = (props) => {
  return <Ota>{(ota) => <Auth ota={ota} {...props} />}</Ota>
}
export default AuthWithOta
