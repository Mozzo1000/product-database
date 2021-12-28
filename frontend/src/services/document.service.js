import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAllDocuments = (product_id, filter) => {
  if(!filter) {
    return axios.get(API_URL + "document/" + product_id,  { headers: authHeader() });
  } else {
    return axios.get(API_URL + "document/" + product_id + filter,  { headers: authHeader() });
  }
};

const addDocument = (data) => {
  return axios.post(API_URL + "document", data, {
  }, { headers: authHeader() });
};


const exportedObject = {
    addDocument,
    getAllDocuments,
};

export default exportedObject;