import signupService from "../services/signup.js";
import loginService from "../services/login.js";

const useSignup = () => {
  const signup = async (userInfo) => {
    try {
      const response = await signupService.signup(userInfo);

      const { email, password } = userInfo;
      const credentials = { email, password };
      await loginService.login(credentials);

      localStorage.setItem("token", response.token);

      return response;
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return { signup };
};

export default useSignup;
