import { useDispatch } from "react-redux";
import {
  saveGlobalUser,
  signupUser,
  eraseGlobalUser,
  updateUser,
  deleteUser,
} from "../redux/reducers/userReducer.js";

const useAuth = () => {
  const dispatch = useDispatch();

  const signup = async (userInfo) => {
    return await dispatch(signupUser(userInfo)); //Pone vscode que no es necesario el await¿?¿?
  };

  const login = async (credentials) => {
    return await dispatch(saveGlobalUser(credentials)); //Pone vscode que no es necesario el await¿?¿?
  };

  const logout = () => {
    dispatch(eraseGlobalUser());
  };

  const editUser = async (newUserData) => {
    return await dispatch(updateUser(newUserData));
  };

  const deleteAcc = async () => {
    return await dispatch(deleteUser()); //Pone vscode que no es necesario el await¿?¿?
  };

  return { signup, login, logout, editUser, deleteAcc };
};

export default useAuth;
