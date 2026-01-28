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
    await dispatch(signupUser(userInfo)); //Pone vscode que no es necesario el await¿?¿?
  };

  const login = async (credentials) => {
    await dispatch(saveGlobalUser(credentials)); //Pone vscode que no es necesario el await¿?¿?
  };

  const logout = () => {
    dispatch(eraseGlobalUser());
  };

  const editUser = async (newUserData) => {
    await dispatch(updateUser(newUserData));
  };

  const deleteAcc = async () => {
    await dispatch(deleteUser()); //Pone vscode que no es necesario el await¿?¿?
  };

  return { signup, login, logout, editUser, deleteAcc };
};

export default useAuth;
