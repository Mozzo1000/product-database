import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAllAttributes = (filter) => {
  if(!filter) {
    return axios.get(API_URL + "attributes", { headers: authHeader() });
  } else {
    return axios.get(API_URL + "attributes" + filter, { headers: authHeader() });
  }
};

const addAttribute = (product_id, name, value) => {
  return axios.post(API_URL + "attributes", {
    product_id,
    name,
    value,
  }, { headers: authHeader() });
};


const getAttribute = (attribute_id) => {
  return axios.get(API_URL + "attributes/" + attribute_id, {}, { headers: authHeader() });
};

const editAttribute = (attribute_id, name, value) => {
  return axios.post(API_URL + "attributes/edit/" + attribute_id, {
    name,
    value,
  }, { headers: authHeader() });
};

const removeAttribute = (attribute_id) => {
  return axios.delete(API_URL + "attributes/" + attribute_id, {}, { headers: authHeader() });
};

const exportedObject = {
    getAllAttributes,
    getAttribute,
    addAttribute,
    editAttribute,
    removeAttribute,
};

export default exportedObject;
