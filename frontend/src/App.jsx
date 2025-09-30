import "./App.css";
import { Routes, Route } from "react-router-dom";
import useAuthInitAndSync from "./hooks/useAuthInitAndSync";
import useInitWeeks from "./hooks/useInitWeeks";
import useMyAliments from "./hooks/useMyAliments";

import BreadcrumbListener from "./components/BreadcrumbListener";
import Breadcrumb from "./components/Breadcrumb";
import Menu from "./components/Menu";
import Logout from "./components/Logout";
import Home from "./components/Home";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import PrivateRoute from "./components/PrivateRoute";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import MyAlimentForm from "./components/MyAlimentForm"; //Igual cambiarle el nombre no estaría mal.
import AccountView from "./components/AccountView";
import WeekSearch from "./components/WeekSearch";
import WeekItem from "./components/WeekItem";
import DayItem from "./components/DayItem";
import MealItem from "./components/MealItem";
import NotFound from "./components/NotFound";

const App = () => {
  useAuthInitAndSync();
  useInitWeeks().get();
  useMyAliments().get();

  return (
    <>
      <BreadcrumbListener />
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
