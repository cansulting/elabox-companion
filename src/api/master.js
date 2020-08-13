import axios from "axios";

class API {
  constructor() {
    this.axios = axios.create({
      baseURL: "http://elabox.local:3002",
    });
  }

  checkUpdate = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.axios.get("/checkUpdate");
        return resolve(response.data);
      } catch (error) {
        return reject(error);
      }
    });
  };

  updateNow = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.axios.get("/updateNow");
        return resolve(response.data);
      } catch (error) {
        return reject(error);
      }
    });
  };
}

export default new API();
