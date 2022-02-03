import axios from "axios";
const PUBLIC_URI = window.location.hostname + ":3001";
class API {
  constructor() {
    this.axios = axios.create({ baseURL: `http://${PUBLIC_URI}` });
  }

  login = (pwd) => {
    return fetch(`http://${PUBLIC_URI}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pwd,
      }),
    });
  };
  getRateLimitWaitTime= () => {
    return fetch(`http://${PUBLIC_URI}/rateLimitWaitTime`,{
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }      
    }).then(response=>response.json())
  }
  fetchEla = async () => {
    const response = await this.axios.get("/ela");
    return response.data;
  };

  fetchEID = async () => {
    const response = await this.axios.get("/eid");
    //console.log(response)
    return response.data;
  };

  fetchESC = async () => {
    const response = await this.axios.get("/esc");
    //console.log(response)
    return response.data;
  };

  fetchCarrier = async () => {
    const response = await this.axios.get("/carrier");
    return response.data;
  };
  fetchFeeds = async () => {
    const response = await this.axios.get("/feeds");
    return response.data;
  };

  checkInstallation = () => {
    return fetch(`http://${PUBLIC_URI}/checkInstallation`).then((response) =>
      response.json()
    );
  };

  createWallet = (pwd) => {
    return fetch(`http://${PUBLIC_URI}/createWallet`, {
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

  serviceStatus = () => {
    return fetch(`http://${PUBLIC_URI}/serviceStatus`).then((response) =>
      response.json()
    );
  };

  restartMainChain = (pwd) => {
    return fetch(`http://${PUBLIC_URI}/restartMainchain`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  resyncMainchain = (pwd) => {
    return fetch(`http://${PUBLIC_URI}/resyncMainchain`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  restartEID = () => {
    return fetch(`http://${PUBLIC_URI}/restartEID`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  resyncEID = () => {
    return fetch(`http://${PUBLIC_URI}/resyncEID`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  restartESC = () => {
    return fetch(`http://${PUBLIC_URI}/restartESC`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  resyncESC = () => {
    return fetch(`http://${PUBLIC_URI}/resyncESC`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  restartCarrier = () => {
    return fetch(`http://${PUBLIC_URI}/restartCarrier`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };
  restartFeeds = () => {
    return fetch(`http://${PUBLIC_URI}/restartFeeds`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };
  getBalance = (address) => {
    return fetch(`http://${PUBLIC_URI}/getBalance`, {
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

  sendElaPassswordVerification = (pwd) => {
    return fetch(`http://${PUBLIC_URI}/sendElaPassswordVerification`, {
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

  resyncNodeVerification = (pwd) => {
    return fetch(`http://${PUBLIC_URI}/resyncNodeVerification`, {
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

  sendTx = (recipient, amount, pwd) => {
    return fetch(`http://${PUBLIC_URI}/sendTx`, {
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
    console.log(
      "https://node1.elaphant.app/api/3/history/" +
        address +
        "?pageNum=1&pageSize=10&order=desc"
    );

    return fetch(
      "https://node1.elaphant.app/api/3/history/" +
        address +
        "?pageNum=1&pageSize=10&order=desc"
    ).then((response) => response.json());
  };

  getOnion = () => {
    return axios.get(`http://${PUBLIC_URI}/getOnion`);
  };

  regenerateOnion = () => {
    return axios.get(`http://${PUBLIC_URI}/regenerateOnion`);
  };
  checkUpdates = async () => {
    const { data } = await axios.get(`http://${PUBLIC_URI}/check_new_updates`);
    return data;
  };
  processUpdate = async () => {
    const { data } = await axios.get(`http://${PUBLIC_URI}/update_version`, {});
    return data;
  };
  processDownloadPackage = async () => {
    const { data } = await axios.get(`http://${PUBLIC_URI}/download_package`);
    return data;
  };
  getVersionDetails = async (version_type) => {
    const { data } = await axios.post(`http://${PUBLIC_URI}/version_info`, {
      version_type,
    });
    return data;
  };
  restart = async () => {
    await axios.post(`http://${PUBLIC_URI}/restart`);
  };  
  shutdown = async () => {
    await axios.post(`http://${PUBLIC_URI}/shutdown`);    
    setTimeout(()=>{
      window.location.reload()
    },5000)    
  }
  checkElaboxStatus = async () =>{
    const { data } = await axios.get(`http://${PUBLIC_URI}/check_elabox_status`);  
    return data  
  };
  downloadWallet = () => {
    const response = {
      file: `http://${PUBLIC_URI}/downloadWallet`,
    };
    // now, let's download:
    window.location.href = response.file;
  };
}

export default new API();
