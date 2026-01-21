import axios from "axios";
const baseURL = "/api/users";
let token;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const signup = async (newObject) => {
  const response = await axios.post(baseURL, newObject);
  return response.data;
};

const update = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(baseURL, newObject, config);
  return response.data;
};

const del = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseURL}/`, config);
  return response.data;
};

export default {
  setToken,
  signup,
  update,
  del,
};
