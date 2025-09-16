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

    const result = days.reduce(
      (sumDays, day) =>
        sumDays +
        day.meals.reduce(
          (sumMeals, meal) =>
            sumMeals +
            meal.aliments.reduce((sumAliments, aliment) => {
              if (aliment.custom_kcal && !aliment.user_aliment) {
                return sumAliments + aliment.custom_kcal;
              } else if (!aliment.custom_kcal && aliment.user_aliment) {
                return (
                  sumAliments +
                  (aliment.grams *
                    (aliment.user_aliment?.nutrition_facts?.kcal_100g ?? 0)) /
                    100
                );
              } else return sumAliments + 0;
            }, 0),
          0,
        ),
      0,
    );
    return Math.round(result * 100) / 100;
  },
);
