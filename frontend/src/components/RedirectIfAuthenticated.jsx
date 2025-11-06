import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RedirectIfAuthenticated = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  if (user) {
    // Si venimos de una ruta protegida, vuelve ahí; si no, vete a /search
    const from = location.state?.from?.pathname || "/weeks";
    return <Navigate to={from} replace />;
  }
  return <Outlet />; //Página pública
};

export default RedirectIfAuthenticated;
