import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getAll = () => {
    return axios.get(API_URL + "inventory", { headers: authHeader() });
};

const add = (product_id, year, quantity, cost ) => {
  return axios.post(API_URL + "inventory", {
    product_id,
    year,
    quantity,
    cost,
  }, { headers: authHeader() });
};

const remove = (inventory_id) => {
  return axios.delete(API_URL + "inventory/" + inventory_id, {}, { headers: authHeader() });
};

const exportedObject = {
    getAll,
    add,
    remove,
};

export default exportedObject;
