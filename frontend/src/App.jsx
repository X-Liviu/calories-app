import "./App.css";
import { Routes, Route } from "react-router-dom";
import useInitializeAuth from "./hooks/useInitializeAuth";
import useMyAliments from "./hooks/useMyAliments";

import Breadcrumb from "./components/Breadcrumb";
import Menu from "./components/Menu";
import Logout from "./components/Logout";
import Home from "./components/Home";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import PrivateRoute from "./components/PrivateRoute";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import MyAlimentForm from "./components/MyAlimentForm"; //Igual cambiarle el nombre no estaría mal.
import WeekSearch from "./components/WeekSearch";
import WeekItem from "./components/WeekItem";
import DayItem from "./components/DayItem";
import MealItem from "./components/MealItem";

const App = () => {
  useInitializeAuth();
  useMyAliments().get();
  return (
    <>
      <Breadcrumb />
      <Menu />
      <Logout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/my-aliments" element={<MyAlimentForm />} />
          <Route path="/weeks" element={<WeekSearch />} />
          <Route path="/weeks/:weekId/" element={<WeekItem />} />
          <Route path="/weeks/:weekId/:dayId" element={<DayItem />} />
          <Route path="/weeks/:weekId/:dayId/:mealId" element={<MealItem />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
