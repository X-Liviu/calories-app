import loginService from "../services/login.js";

const useLogin = () => {
  const login = async (credentials) => {
    try {
      const response = await loginService.login(credentials);
      localStorage.setItem("token", response.token);

      return response;
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return { login };
};

export default useLogin;
