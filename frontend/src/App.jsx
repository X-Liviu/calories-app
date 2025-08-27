import "./App.css";
import { Routes, Route } from "react-router-dom";
import useInitializeAuth from "./hooks/useInitializeAuth";
import Menu from "./components/Menu";
import Home from "./components/Home";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

const App = () => {
  useInitializeAuth();
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
