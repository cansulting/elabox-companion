const PUBLIC_URI = "http://elabox.local:3001";
// const PUBLIC_URI = "http://192.168.0.28:3001";
class API {
  login = (pwd) => {
    return fetch(`${PUBLIC_URI}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pwd,
      }),
    }).then((response) => response.json());
  };

  checkInstallation = () => {
    return fetch(`${PUBLIC_URI}/checkInstallation`).then((response) =>
      response.json()
    );
  };

  createWallet = (pwd) => {
    return fetch(`${PUBLIC_URI}/createWallet`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pwd,
      }),
    }).then((response) => response.json());
  };

  latestBlock = () => {
    return fetch(`${PUBLIC_URI}/latestblock`).then((response) =>
      response.json()
    );
  };

  blockSizes = () => {
    return fetch(`${PUBLIC_URI}/blocksizes`).then((response) =>
      response.json()
    );
  };

  serviceStatus = () => {
    return fetch(`${PUBLIC_URI}/serviceStatus`).then((response) =>
      response.json()
    );
  };

  nbOfTx = () => {
    return fetch(`${PUBLIC_URI}/nbOfTx`).then((response) => response.json());
  };

  restartMainChain = (pwd) => {
    return fetch(`${PUBLIC_URI}/restartMainchain`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pwd: pwd,
      }),
    }).then((response) => response.json());
  };

  getBalance = (address) => {
    return fetch(`${PUBLIC_URI}/getBalance`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
      }),
    }).then((response) => response.json());
  };

  sendTx = (recipient, amount, pwd) => {
    return fetch(`${PUBLIC_URI}/sendTx`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: recipient,
        amount: amount,
        pwd: pwd,
      }),
    }).then((response) => response.json());
  };

  txHistory = (address) => {
    return fetch(
      "https://node1.elaphant.app/api/3/history/" +
        address +
        "?pageNum=1&pageSize=10&order=desc"
    ).then((response) => response.json());
  };
}

export default new API();
