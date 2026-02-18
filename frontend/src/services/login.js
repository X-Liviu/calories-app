import apiClient from "./apiClient";
const baseURL = "/login";

const login = async (credentials) => {
  const response = await apiClient.post(baseURL, credentials);
  return response.data;
};

export default {
  login,
};
