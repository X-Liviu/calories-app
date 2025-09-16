import { createSelector } from "reselect";

export const selectDay = (state, weekId, dayId) =>
  state.weeks.find((w) => w.id === weekId)?.days.find((d) => d.id === dayId);

export const selectDayCalories = createSelector(
  [(state, meals) => meals],
  (meals) => {
    if (!meals || meals.length === 0) return 0;

    const result = meals.reduce(
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
    );

    return Math.round(result * 100) / 100;
  },
);
