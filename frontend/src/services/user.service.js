import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getMe = () => {
  return axios.get(API_URL + "users/me", { headers: authHeader() });
};

const editMe = (data) => {
  return axios.patch(API_URL + "users/me", data, { headers: authHeader() });
};

const getAllUsers = () => {
  return axios.get(API_URL + "users", {headers: authHeader() });
}

const exportedObject = {
    getMe,
    editMe,
    getAllUsers,
};

export default exportedObject;
