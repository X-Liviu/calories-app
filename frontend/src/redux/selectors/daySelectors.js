import { createSelector } from "reselect";

export const selectDay = (state, weekId, dayId) =>
  state.weeks.find((w) => w.id === weekId)?.days.find((d) => d.id === dayId);

export const selectDayCalories = createSelector(
  [(state, meals) => meals],
  (meals) => {
    if (!meals || meals.length === 0) return 0;

    return meals.reduce(
      (sumMeals, meal) =>
        sumMeals +
        meal.aliments.reduce(
          (sumAliments, aliment) =>
            sumAliments +
            (aliment.grams *
              (aliment?.user_aliment?.nutrition_facts?.kcal_100g ?? 0)) /
              100,
          0,
        ),
      0,
    );
  },
);
