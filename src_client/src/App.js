import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import backend from "./api/backend";
import RootStore from "./store";
import Socket from "./Socket";
import Landing from "./views/components/Landing"
const Auth = React.lazy(() => import("./views/Auth"));
const Config = React.lazy(() => import("./views/Config"));
const Download = React.lazy(() => import("./views/Download"));
const loading = () => <Landing/>;
class App extends React.Component {
  constructor(props) {
    super(props);
    try {
      RootStore.blockchain.ela.fetchData();
      RootStore.blockchain.eid.fetchData();
      RootStore.blockchain.esc.fetchData();
      RootStore.blockchain.carrier.fetchData();
      RootStore.blockchain.feeds.fetchData();    
      backend.checkInstallation().then((responseJson) => {
        localStorage.setItem("isconfiged", responseJson.configed.trim());
        this.setState({ loading: false });
      });
    } catch (e) {
      console.error(e);
      this.setState({ loading: false });
    }
  }

  state = {
    loading: true,
  };
  render() {
    if (this.state.loading) {
      return (
        <Router basename={process.env.PUBLIC_URL}>
          <div>
            <React.Suspense fallback={loading()}>
              <Switch>
                <Route path="/check">
                  <pre
                    style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                  >
                    {JSON.stringify({ ok: true })}
                  </pre>
                </Route>
                <Route path="/" component={loading} />
              </Switch>
            </React.Suspense>
          </div>
        </Router>
      );
    } else {
      return (
        <Router basename={process.env.PUBLIC_URL}>
          <Socket>
            <div>
              <React.Suspense fallback={loading()}>
                <Switch>
                  <Route path="/config">
                    <Config />
                  </Route>
                  <Route path="/download">
                    <Download />
                  </Route>
                  <Route path="/check">
                    <pre
                      style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                    >
                      {JSON.stringify({ ok: true })}
                    </pre>
                  </Route>              
                  <PrivateRoute path="/">
                    <Auth />
                  </PrivateRoute>
                </Switch>
              </React.Suspense>
            </div>
          </Socket>
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
        isConfiged === "true" ? (
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
