import axios from "axios"
const PUBLIC_URI = window.location.hostname + ":3001"
class API {
  constructor() {
    this.axios = axios.create({ baseURL: `http://${PUBLIC_URI}` })
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
    }).then((response) => response.json())
  }

  fetchEla = async () => {
    const response = await this.axios.get("/ela")
    return response.data
  }

  fetchDid = async () => {
    const response = await this.axios.get("/did")
    return response.data
  }

  fetchCarrier = async () => {
    const response = await this.axios.get("/carrier")
    return response.data
  }

  checkInstallation = () => {
    return fetch(`http://${PUBLIC_URI}/checkInstallation`).then((response) =>
      response.json()
    )
  }

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
    }).then((response) => response.json())
  }

  serviceStatus = () => {
    return fetch(`http://${PUBLIC_URI}/serviceStatus`).then((response) =>
      response.json()
    )
  }

  restartMainChain = (pwd) => {
    return fetch(`http://${PUBLIC_URI}/restartMainchain`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
  }

  restartDid = () => {
    return fetch(`http://${PUBLIC_URI}/restartDid`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
  }

  resyncDid = () => {
    return fetch(`http://${PUBLIC_URI}/resyncDid`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
  }

  restartCarrier = () => {
    return fetch(`http://${PUBLIC_URI}/restartCarrier`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
  }

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
    }).then((response) => response.json())
  }

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
    }).then((response) => response.json())
  }

  txHistory = (address) => {
    console.log(
      "https://node1.elaphant.app/api/3/history/" +
        address +
        "?pageNum=1&pageSize=10&order=desc"
    )

    return fetch(
      "https://node1.elaphant.app/api/3/history/" +
        address +
        "?pageNum=1&pageSize=10&order=desc"
    ).then((response) => response.json())
  }

  getOnion = () => {
    return axios.get(`http://${PUBLIC_URI}/getOnion`)
  }

  regenerateOnion = () => {
    return axios.get(`http://${PUBLIC_URI}/regenerateOnion`)
  }
  checkUpdates = async () => {
    const { data } = await axios.get(`http://${PUBLIC_URI}/check_new_updates`)
    return data
  }
  processUpdate = async () => {
    const { data } = await axios.get(`http://${PUBLIC_URI}/update_version`, {})
    return data
  }
  processDownloadPackage = async () => {
    const { data } = await axios.get(`http://${PUBLIC_URI}/download_package`, {
      headers: {
        socketId: window.companion_socket.id,
      },
    })
    return data
  }
  getVersionDetails = async (versionType) => {
    const { data } = await axios.post(`http://${PUBLIC_URI}/version_info`, {
      versionType,
    })
    return data
  }
}

export default new API()
