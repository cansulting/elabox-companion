import axios from "axios"
const PUBLIC_URI = window.location.hostname + ":3001"
class API {
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
        }).then((response) => response.json());
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

    latestBlock = () => {
        return fetch(`http://${PUBLIC_URI}/latestblock`).then((response) =>
            response.json()
        );
    };

    blockSizes = () => {
        return fetch(`http://${PUBLIC_URI}/blocksizes`).then((response) =>
            response.json()
        );
    };

    serviceStatus = () => {
        return fetch(`http://${PUBLIC_URI}/serviceStatus`).then((response) =>
            response.json()
        );
    };

    nbOfTx = () => {
        return fetch(`http://${PUBLIC_URI}/nbOfTx`).then((response) => response.json());
    };


    restartAllServices = (pwd) => {
        return fetch(`http://${PUBLIC_URI}/restartAll`, {
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

    restartMainChain = (pwd) => {
        return fetch(`http://${PUBLIC_URI}/restartMainchain`, {
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


    restartDid = () => {
        return fetch(`http://${PUBLIC_URI}/restartDid`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },

        })
            .then(response => response.json())
    };

    resyncDid = () => {
        return fetch(`http://${PUBLIC_URI}/resyncDid`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },

        })
            .then(response => response.json())
    };


    restartCarrier = () => {
        return fetch(`http://${PUBLIC_URI}/restartCarrier`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
    };

    restartHive = () => {
        return fetch(`http://${PUBLIC_URI}/restartHive`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
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
        console.log("https://node1.elaphant.app/api/3/history/" + address + "?pageNum=1&pageSize=10&order=desc")

        return fetch(
            "https://node1.elaphant.app/api/3/history/" +
            address +
            "?pageNum=1&pageSize=10&order=desc"
        ).then((response) => response.json());
    };



    getOnion = () => {
        return axios.get(`http://${PUBLIC_URI}/getOnion`)
    }

    regenerateOnion = () => {
        return axios.get(`http://${PUBLIC_URI}/regenerateOnion`)
    }
}

export default new API();