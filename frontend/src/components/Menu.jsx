import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ProfileMenu from "./ProfileMenu/ProfileMenu";

const Menu = () => {
  const user = useSelector((state) => state.user);

  const navStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px", // Espacio entre enlaces
    padding: "10px",
  };

  return (
    <nav className="menu" style={navStyle}>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/weeks">Search</Link>
          <Link to="/my-aliments">Catalog</Link>

          {/* Aquí insertamos el Círculo de Perfil en lugar de "Account" */}
          <div style={{ marginLeft: "auto" }}>
            {" "}
            {/* marginLeft: auto empuja el perfil a la derecha si usas flex */}
            <ProfileMenu />
          </div>
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
