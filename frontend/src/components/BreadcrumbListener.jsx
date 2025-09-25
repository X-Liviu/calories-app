//HECHO POR CHATGPT
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setItem, resetItems } from "../reducers/itemLinkReducer";
import { selectWeeks } from "../redux/selectors/weekSelectors";

const BreadcrumbListener = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const weeks = useSelector(selectWeeks);
  const path = location.pathname;

  useEffect(() => {
    const segments = path.split("/").filter(Boolean);

    // HOME
    if (segments.length === 0) {
      dispatch(resetItems());
      return;
    }

    // MY-ALIMENTS → Home > Catalog
    if (segments[0] === "my-aliments") {
      dispatch(resetItems());
      dispatch(setItem({ name: "Catalog", URL: "/my-aliments" }));
      return;
    }

    // ACCOUNT → Home > My Account
    if (segments[0] === "account") {
      dispatch(resetItems());
      dispatch(setItem({ name: "My Account", URL: "/account" }));
      return;
    }

    // ACCOUNT → Home > Login
    if (segments[0] === "login") {
      dispatch(resetItems());
      dispatch(setItem({ name: "Login", URL: "/login" }));
      return;
    }

    // ACCOUNT → Home > Sign Up
    if (segments[0] === "signup") {
      dispatch(resetItems());
      dispatch(setItem({ name: "Sign Up", URL: "/signup" }));
      return;
    }

    // WEEKS
    if (segments[0] === "weeks") {
      // si solo estamos en /weeks → breadcrumb solo Home
      if (segments.length === 1) {
        dispatch(resetItems());
        return;
      }

      const weekId = segments[1];
      const dayId = segments[2];
      const mealId = segments[3];

      const week = weeks.find((w) => w.id === weekId);
      if (!week) return;

      // Home > Week X
      dispatch(resetItems());
      dispatch(
        setItem({
          name: `Week ${week.numberWeek}`,
          URL: `/weeks/${week.id}`,
        }),
      );

      // Home > Week X > Day Y
      if (dayId) {
        const day = week.days.find((d) => d.id === dayId);
        if (day) {
          dispatch(
            setItem({
              name: day.name,
              URL: `/weeks/${week.id}/${day.id}`,
            }),
          );

          // Home > Week X > Day Y > Meal Z
          if (mealId) {
            const meal = day.meals.find((m) => m.id === mealId);
            if (meal) {
              dispatch(
                setItem({
                  name: meal.name,
                  URL: `/weeks/${week.id}/${day.id}/${meal.id}`,
                }),
              );
            }
          }
        }
      }
    }
  }, [path, weeks, dispatch]);

  return null;
};

export default BreadcrumbListener;
