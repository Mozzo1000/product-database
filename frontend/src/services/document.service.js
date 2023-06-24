import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAllDocuments = (product_id, filter) => {
  if(!filter) {
    return axios.get(API_URL + "documents/" + product_id,  { headers: authHeader() });
  } else {
    return axios.get(API_URL + "documents/" + product_id + filter,  { headers: authHeader() });
  }
};

const addDocument = (data) => {
  return axios.post(API_URL + "documents", data, { headers: authHeader() });
};

const removeDocument = (document_id) => {
  return axios.delete(API_URL + "documents/" + document_id, {}, { headers: authHeader() });
};

const editDocumentOrder = (document_id, order) => {
  return axios.put(API_URL + "documents/" + document_id, {
    order,
  }, { headers: authHeader() });
};

const exportedObject = {
    addDocument,
    getAllDocuments,
    removeDocument,
    editDocumentOrder,
};

export default exportedObject;
