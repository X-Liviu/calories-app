import { createSelector } from "reselect";

export const selectWeeks = (state) => state.weeks;

export const selectWeekByNumber = createSelector(
  [selectWeeks, (state, filterNumber) => filterNumber],
  (weeks, filterNumber) => {
    if (!filterNumber) return weeks;

    const filterStr = String(filterNumber);
    return weeks.filter((w) => String(w.number_week).startsWith(filterStr));
  },
);

export const selectWeekCalories = createSelector(
  [selectWeeks, (state, weekId) => weekId],
  (weeks, weekId) => {
    const week = weeks.find((w) => w.id === weekId);
    if (!week) return 0;
    return week.days.reduce(
      (sumDays, day) =>
        sumDays +
        day.meals.reduce(
          (sumMeals, meal) =>
            sumMeals +
            meal.aliments.reduce(
              (sumAliments, aliment) =>
                sumAliments +
                (aliment.grams *
                  aliment.user_aliment.nutrition_facts.kcal_100g) /
                  100,
              0,
            ),
          0,
        ),
      0,
    );
  },
);
