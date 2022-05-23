import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const get = () => {
  return axios.get(API_URL + "stats", {}, { headers: authHeader() });
};

const exportedObject = {
    get,
};

export default exportedObject;
