import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAllBrands = () => {
    return axios.get(API_URL + "brands", { headers: authHeader() });
};

const addBrand = (name) => {
  return axios.post(API_URL + "brands", {
    name,
  }, { headers: authHeader() });
};


const getBrand = (brand_id) => {
  return axios.get(API_URL + "brands/" + brand_id, {}, { headers: authHeader() });
};


const exportedObject = {
    getAllBrands,
    getBrand,
    addBrand,
};

export default exportedObject;
