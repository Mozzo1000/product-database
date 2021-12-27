import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const addDocument = (data) => {
  return axios.post(API_URL + "document", data, {
  }, { headers: authHeader() });
};


const exportedObject = {
    addDocument,
};

export default exportedObject;
