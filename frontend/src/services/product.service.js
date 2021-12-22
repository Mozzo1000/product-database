import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAllProducts = (filter) => {
  if(!filter) {
    return axios.get(API_URL + "product", { headers: authHeader() });
  } else {
    return axios.get(API_URL + "product" + filter, { headers: authHeader() });
  }
};

const addProduct = (name, brand_id, category_id) => {
  return axios.post(API_URL + "product", {
    name,
    brand_id,
    category_id,
  }, { headers: authHeader() });
};


const getProduct = (product_id) => {
  return axios.get(API_URL + "product/" + product_id, {}, { headers: authHeader() });
};


const exportedObject = {
    getAllProducts,
    getProduct,
    addProduct,
};

export default exportedObject;
