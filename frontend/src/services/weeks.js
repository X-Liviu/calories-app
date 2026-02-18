import apiClient from "./apiClient";
const baseURL = "/weeks";

const getAll = async (year) => {
  const config = {
    params: year ? { year } : {},
  };
  const response = await apiClient.get(baseURL, config);
  return response.data;
};

const create = async (object) => {
  const response = await apiClient.post(baseURL, object);
  return response.data;
};

const del = async (object) => {
  const response = await apiClient.delete(`${baseURL}/${object.id}`);
  return response.data;
};

export default { getAll, create, del };
