import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";
const Logout = () => {
  const user = useSelector((state) => state.user);
  const { logout } = useAuth();
  return user ? <button onClick={logout}>Logout</button> : null;
};

export default Logout;
