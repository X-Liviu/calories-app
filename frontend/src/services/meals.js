import apiClient from "./apiClient";
const baseURL = "/weeks";

const create = async (object) => {
  const response = await apiClient.post(
    `${baseURL}/${object.weekId}/${object.dayId}`,
    object,
  );
  return response.data;
};

const update = async (object) => {
  const response = await apiClient.put(
    `${baseURL}/${object.weekId}/${object.dayId}/${object.mealId}`,
    object,
  );
  return response.data;
};

const del = async (object) => {
  const response = await apiClient.delete(
    `${baseURL}/${object.weekId}/${object.dayId}/${object.mealId}`,
  );
  return response.data;
};

export default {
  create,
  update,
  del,
};
