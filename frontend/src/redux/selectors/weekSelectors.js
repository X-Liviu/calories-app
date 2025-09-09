import { createSelector } from "reselect";

export const selectWeeks = (state) => state.weeks;

export const selectWeek = (state, weekId) =>
  state.weeks.find((w) => w.id === weekId);

export const selectWeekByNumber = createSelector(
  [selectWeeks, (state, filterNumber) => filterNumber],
  (weeks, filterNumber) => {
    if (!filterNumber) return weeks;

    const filterStr = String(filterNumber);
    return weeks.filter((w) => String(w.number_week).startsWith(filterStr));
  },
);

export const selectWeekCalories = createSelector(
  [(state, days) => days],
  (days) => {
    if (!days || days.length === 0) return 0;

    return days.reduce((sumDays, day) => {
      return (
        sumDays +
        day.meals.reduce((sumMeals, meal) => {
          return (
            sumMeals +
            meal.aliments.reduce((sumAliments, aliment) => {
              const kcal =
                aliment?.user_aliment?.nutrition_facts?.kcal_100g ?? 0;
              return sumAliments + (aliment.grams * kcal) / 100;
            }, 0)
          );
        }, 0)
      );
    }, 0);
  },
);
