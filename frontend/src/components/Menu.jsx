import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Menu = () => {
  const user = useSelector((state) => state.user);
  return (
    <div className="menu">
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
    </div>
  );
};

export default Menu;
