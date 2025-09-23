import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setItem, resetItems } from "../reducers/itemLinkReducer";
import { selectWeeks } from "../redux/selectors/weekSelectors";

//Ahora mismo, siempre se añade hasta lo más profundo posible, y además, de momento sólo se tiene en cuenta las semanas. Cuando quiera implementar el ir a my-aliments, no me va a funcionar.
const BreadcrumbListener = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const weeks = useSelector(selectWeeks);

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      dispatch(resetItems());
      return;
    }

    if (segments[0] === "weeks" && segments.length === 1) {
      dispatch(resetItems());
      return;
    }

    if (segments[0] === "weeks") {
      const weekId = segments[1];
      const dayId = segments[2];
      const mealId = segments[3];

      const week = weeks.find((w) => w.id === weekId);
      if (week) {
        dispatch(
          setItem({
            name: `Week ${week.numberWeek}`,
            URL: `/weeks/${week.id}`,
          }),
        );

        if (dayId) {
          const day = week.days.find((d) => d.id === dayId);
          if (day) {
            dispatch(
              setItem({
                name: `${day.name}`,
                URL: `/weeks/${week.id}/${day.id}`,
              }),
            );

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
    }
  }, [location, weeks, dispatch]);

  return null;
};

export default BreadcrumbListener;
