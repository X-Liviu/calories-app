import axios from "axios";
const baseUrl = "http://localhost:3001/weeks";
//let token;

const setToken = (/*newToken*/) => {
  //token = `Bearer ${newToken}`;
};

const getAll = async () => {
  // const config = {
  //   headers: { Authorization: token },
  // };
  const response = await axios.get(baseUrl /*config*/);
  return response.data;
};

const create = async (object) => {
  // const config = {
  //   headers: { Authorization: token },
  // };
  const response = await axios.post(baseUrl, object /*config*/);
  return response.data;
};

export default {
  setToken,
  getAll,
  create,
};
