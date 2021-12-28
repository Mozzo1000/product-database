import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAllAttributes = (filter) => {
  if(!filter) {
    return axios.get(API_URL + "attribute", { headers: authHeader() });
  } else {
    return axios.get(API_URL + "attribute" + filter, { headers: authHeader() });
  }
};

const addAttribute = (product_id, name, value) => {
  return axios.post(API_URL + "attribute", {
    product_id,
    name,
    value,
  }, { headers: authHeader() });
};


const getAttribute = (attribute_id) => {
  return axios.get(API_URL + "attribute/" + attribute_id, {}, { headers: authHeader() });
};

const editAttribute = (attribute_id, name, value) => {
  return axios.post(API_URL + "attribute/edit/" + attribute_id, {
    name,
    value,
  }, { headers: authHeader() });
};


const exportedObject = {
    getAllAttributes,
    getAttribute,
    addAttribute,
    editAttribute,
};

export default exportedObject;
