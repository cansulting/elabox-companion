import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import API from "./api";
const { exec } = require('child_process');


const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);
const Auth = React.lazy(() => import("./views/Auth"));
const Config = React.lazy(() => import("./views/Config"));
const Download = React.lazy(() => import("./views/Download"));
let elaPath = "/home/elabox/supernode/ela";

class App extends React.Component {
  constructor(props) {
    super(props);

    exec(
      "cd " + elaPath + "; ./ela-cli wallet create -p " + "bangbang" + "",
      { maxBuffer: 1024 * 500 },
      async (err, stdout, stderr) => {
        console.log("OUT1", stdout);
        // res.json({balance})
      }
    );

    API.checkInstallation().then((responseJson) => {
      console.log("Yolo", responseJson);
      localStorage.setItem("isconfiged", JSON.stringify(responseJson).trim());
      this.setState({ loading: false });
    });
  }

  state = {
    loading: true,
  };

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <Router>
          <div>
            <React.Suspense fallback={loading()}>
              <Switch>
                <Route path="/config">
                  <Config />
                </Route>
                <Route path="/download">
                  <Download />
                </Route>
                <PrivateRoute path="/">
                  <Auth />
                </PrivateRoute>
              </Switch>
            </React.Suspense>
          </div>
        </Router>
      );
    }
  }
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  const isConfiged = localStorage.getItem("isconfiged");
  console.log(localStorage);
  console.log(isConfiged);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isConfiged == "true" ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/config",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default App;
