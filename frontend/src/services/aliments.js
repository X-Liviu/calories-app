import axios from "axios";
//No olvidar cambiar la baseURL después
const baseURL = "http://localhost:7000/api/weeks";
let token;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const create = async (object) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(
    `${baseURL}/${object.weekId}/${object.dayId}/${object.mealId}`,
    object,
    config,
  );
  return response.data;
};

const del = async (object) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(
    `${baseURL}/${object.weekId}/${object.dayId}/${object.mealId}/${object.mealAlimentId}`,
    config,
  );
  return response.data;
};

export default {
  setToken,
  create,
  del,
};
