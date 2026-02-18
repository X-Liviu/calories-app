import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.request.use(
  (config) => {
    const loggedUserJSON = window.localStorage.getItem("token");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
