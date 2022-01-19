import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";

const getMe = () => {
  console.log(authHeader());
  return axios.get(API_URL + "users/me", { headers: authHeader() });
};

const exportedObject = {
    getMe,
};

export default exportedObject;
