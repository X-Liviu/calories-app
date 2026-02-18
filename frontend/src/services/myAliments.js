import apiClient from "./apiClient";
const baseURL = "/my-aliments";

const getAll = async () => {
  const response = await apiClient.get(baseURL);
  return response.data;
};

const create = async (object) => {
  const response = await apiClient.post(baseURL, object);
  return response.data;
};

const update = async (object) => {
  const { id, ...rest } = object;
  const response = await apiClient.put(`${baseURL}/${id}`, rest);
  return response.data;
};

const del = async (object) => {
  const response = await apiClient.delete(`${baseURL}/${object.id}`);
  return response.data;
};

export default {
  getAll,
  create,
  update,
  del,
};
