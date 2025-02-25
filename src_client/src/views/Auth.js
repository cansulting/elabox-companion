import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import Ota from "./components/Ota"
import Landing from "./components/Landing"
const loading = () => <Landing/>
const Companion = React.lazy(() => import("./Companion"))
const Login = React.lazy(() => import("./Login"))

function Auth({ ota }) {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/">
              <Companion ota={ota} />
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
