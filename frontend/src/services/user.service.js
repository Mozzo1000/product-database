import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getMe = () => {
  console.log(authHeader());
  return axios.get(API_URL + "users/me", { headers: authHeader() });
};

const editMe = (name, email) => {
  return axios.put(API_URL + "users/me", {
    name,
    email,
  }, { headers: authHeader() });
};

const exportedObject = {
    getMe,
    editMe,
};

export default exportedObject;
