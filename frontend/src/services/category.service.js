import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAllCategories = () => {
    return axios.get(API_URL + "categories", { headers: authHeader() });
};

const addCategory = (name) => {
  return axios.post(API_URL + "categories", {
    name,
  }, { headers: authHeader() });
};


const getCategory = (category_id) => {
  return axios.get(API_URL + "categories/" + category_id, {}, { headers: authHeader() });
};


const exportedObject = {
    getAllCategories,
    getCategory,
    addCategory,
};

export default exportedObject;
