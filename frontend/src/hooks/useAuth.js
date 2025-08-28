import { useDispatch } from "react-redux";
import {
  saveGlobalUser,
  signupUser,
  eraseGlobalUser,
} from "../reducers/userReducer.js";

const useAuth = () => {
  const dispatch = useDispatch();

  const signup = async (userInfo) => {
    await dispatch(signupUser(userInfo)); //Pone vscode que no es necesario el await¿?¿?
  };

  const login = async (credentials) => {
    await dispatch(saveGlobalUser(credentials)); //Pone vscode que no es necesario el await¿?¿?
  };

  const logout = () => {
    dispatch(eraseGlobalUser());
  };

  return { signup, login, logout };
};

export default useAuth;
