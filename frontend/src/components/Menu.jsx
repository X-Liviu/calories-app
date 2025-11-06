import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Menu = () => {
  const user = useSelector((state) => state.user);
  return (
    <nav className="menu">
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/weeks">Search</Link>
          <Link to="/my-aliments">Catalog</Link>
          <Link to="/account">Account</Link>
        </>
      ) : (
        <>
          <Link to={"/login"}>Login</Link>
          <Link to={"/signup"}>Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default Menu;
