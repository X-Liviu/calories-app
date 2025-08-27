import { useDispatch } from "react-redux";
import { saveGlobalUser, eraseGlobalUser } from "../reducers/userReducer.js";
import loginService from "../services/login.js";
import signupService from "../services/signup.js";

const useAuth = () => {
  const dispatch = useDispatch();

  const signup = async (userInfo) => {
    try {
      await signupService.signup(userInfo);

      const { email, password } = userInfo;
      const credentials = { email, password };
      await login(credentials);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      dispatch(saveGlobalUser(user)); //Usar Thunk para guardar usuario global

      //useNavigate("/search") Tiene sentido que se haga el navigate desde aquí??
      return user;
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    dispatch(eraseGlobalUser()); //Usar Thunk para borrar usuario global
  };

  return { signup, login, logout };
};

export default useAuth;
