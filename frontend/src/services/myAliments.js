import axios from "axios";
//No olvidar cambiar la baseURL después
const baseURL = "http://localhost:7000/api/my-aliments";
let token;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(baseURL, config);
  return response.data;
};

const create = async (object) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseURL, object, config);
  return response.data;
};

const update = async (object) => {
  const config = {
    headers: { Authorization: token },
  };
  const { id, ...rest } = object;
  const response = await axios.put(`${baseURL}/${id}`, rest, config);
  return response.data;
};

const del = async (object) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseURL}/${object.id}`, config);
  return response.data;
};

export default {
  setToken,
  getAll,
  create,
  update,
  del,
};
