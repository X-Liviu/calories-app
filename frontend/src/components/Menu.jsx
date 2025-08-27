import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Menu = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <Link to={"/"}>Home</Link>
      {user ? (
        <Link to={"/logout"}>Logout</Link>
      ) : (
        <>
          <Link to={"/login"}>Login</Link>
          <Link to={"/signup"}>Sign Up</Link>
        </>
      )}
    </>
  );
};

export default Menu;
