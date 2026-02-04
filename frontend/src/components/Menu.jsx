import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ProfileMenu from "./ProfileMenu/ProfileMenu";

const Menu = () => {
  const user = useSelector((state) => state.user);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">TrackBites</Link>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/weeks">Search</Link>
            <Link to="/my-aliments">Catalog</Link>
            <div className="profile-wrapper">
              <ProfileMenu />
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Menu;
