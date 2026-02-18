import apiClient from "./apiClient";
const baseURL = "/weeks";

const create = async (object) => {
  const response = await apiClient.post(`${baseURL}/${object.weekId}`, object);
  return response.data;
};

const del = async (object) => {
  const response = await apiClient.delete(
    `${baseURL}/${object.weekId}/${object.dayId}`,
  );
  return response.data;
};

export default {
  create,
  del,
};
