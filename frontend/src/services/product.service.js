import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAllProducts = (filter) => {
  if(!filter) {
    return axios.get(API_URL + "products", { headers: authHeader() });
  } else {
    return axios.get(API_URL + "products" + filter, { headers: authHeader() });
  }
};

const addProduct = (name, brand_id, category_id, description) => {
  return axios.post(API_URL + "products", {
    name,
    brand_id,
    category_id,
    description,
  }, { headers: authHeader() });
};


const getProduct = (product_id) => {
  return axios.get(API_URL + "products/" + product_id, {}, { headers: authHeader() });
};


const exportedObject = {
    getAllProducts,
    getProduct,
    addProduct,
};

export default exportedObject;
