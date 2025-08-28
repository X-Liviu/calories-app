import "./App.css";
import { Routes, Route } from "react-router-dom";
import useInitializeAuth from "./hooks/useInitializeAuth";
import Menu from "./components/Menu";
import Home from "./components/Home";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import PrivateRoute from "./components/PrivateRoute";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import WeekSearch from "./components/WeekSearch";
import Logout from "./components/Logout";

const App = () => {
  useInitializeAuth();
  return (
    <>
      <Menu />
      <Logout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/weeks" element={<WeekSearch />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
