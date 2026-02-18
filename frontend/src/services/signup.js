import apiClient from "./apiClient";
const baseURL = "/users";

const signup = async (newObject) => {
  const response = await apiClient.post(baseURL, newObject);
  return response.data;
};

const update = async (newObject) => {
  const response = await apiClient.put(baseURL, newObject);
  return response.data;
};

const del = async () => {
  const response = await apiClient.delete(`${baseURL}/`);
  return response.data;
};

export default {
  signup,
  update,
  del,
};
