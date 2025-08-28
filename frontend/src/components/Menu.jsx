import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Menu = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <Link style={{ paddingRight: 5 }} to="/">
        Home
      </Link>
      {user ? (
        <>
          <Link to="/weeks">Search</Link>
        </>
      ) : (
        <>
          <Link style={{ paddingRight: 5 }} to={"/login"}>
            Login
          </Link>
          <Link style={{ paddingRight: 5 }} to={"/signup"}>
            Sign Up
          </Link>
        </>
      )}
    </>
  );
};

export default Menu;
