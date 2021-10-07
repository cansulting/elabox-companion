import axios from "axios"

class API {
  constructor() {
    this.axios = axios.create({
      baseURL: "http://" + window.location.hostname + ":3001",
    })
  }

  checkUpdate = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.axios.get("/checkUpdate")
        return resolve(response.data)
      } catch (error) {
        return reject(error)
      }
    })
  }

  updateNow = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.axios.get("/updateNow")
        return resolve(response.data)
      } catch (error) {
        return reject(error)
      }
    })
  }

  getVersion = () => {
    return this.axios.get(`/getVersion`)
  }

  submitForm = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.axios.post("/sendSupportEmail", data)
        return resolve(response.data)
      } catch (error) {
        return reject(error)
      }
    })
  }
}

export default new API()
