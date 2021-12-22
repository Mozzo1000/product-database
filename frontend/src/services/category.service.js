import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAllCategories = () => {
    return axios.get(API_URL + "category", { headers: authHeader() });
};

const addCategory = (name) => {
  return axios.post(API_URL + "category", {
    name,
  }, { headers: authHeader() });
};


const getCategory = (category_id) => {
  return axios.get(API_URL + "category/" + category_id, {}, { headers: authHeader() });
};


const exportedObject = {
    getAllCategories,
    getCategory,
    addCategory,
};

export default exportedObject;
