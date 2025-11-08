import "./App.css";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import useAuthInitAndSync from "./hooks/useAuthInitAndSync";
import useInitWeeks from "./hooks/useInitWeeks";
import useMyAliments from "./hooks/useMyAliments";

import BreadcrumbListener from "./components/BreadcrumbListener";
import Breadcrumb from "./components/Breadcrumb";
import Menu from "./components/Menu";
import Home from "./components/Home";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import PrivateRoute from "./components/PrivateRoute";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import MyAlimentForm from "./components/MyAlimentForm/MyAlimentForm"; //Igual cambiarle el nombre no estaría mal.
import AccountView from "./components/AccountView/AccountView";
import WeekSearch from "./components/WeekSearch/WeekSearch";
import WeekItem from "./components/WeekItem/WeekItem";
import DayItem from "./components/DayItem/DayItem";
import MealItem from "./components/MealItem/MealItem";
import NotFound from "./components/NotFound";

const App = () => {
  useAuthInitAndSync();

  const { get: initWeeks } = useInitWeeks();
  const { get: initAliments } = useMyAliments();
  const { lastSavedYear } = useSelector((state) => state.year);
  // Inicializar semanas al montar o cuando cambie year
  useEffect(() => {
    initWeeks(lastSavedYear);
  }, [initWeeks, lastSavedYear]);

  // Inicializar mis alimentos solo al montar
  useEffect(() => {
    initAliments();
  }, [initAliments]);

  return (
    <>
      <BreadcrumbListener />
      <Breadcrumb />
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/my-aliments" element={<MyAlimentForm />} />
          <Route path="/account" element={<AccountView />} />
          <Route path="/weeks" element={<WeekSearch />} />
          <Route path="/weeks/:weekId/" element={<WeekItem />} />
          <Route path="/weeks/:weekId/:dayId" element={<DayItem />} />
          <Route path="/weeks/:weekId/:dayId/:mealId" element={<MealItem />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
