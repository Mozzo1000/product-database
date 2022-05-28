import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const add = (product_id) => {
  return axios.post(API_URL + "favorites", {product_id}, { headers: authHeader() });
};

const getAll = () => {
  return axios.get(API_URL + "favorites", { headers: authHeader() });
};

const remove = (product_id) => {
    return axios.delete(API_URL + "favorites/" + product_id, { headers: authHeader() });
};

const isFavorite = (product_id) => {
    return axios.get(API_URL + "favorites/" + product_id, { headers: authHeader() });
};

const exportedObject = {
    add,
    getAll,
    remove,
    isFavorite,
};

export default exportedObject;
