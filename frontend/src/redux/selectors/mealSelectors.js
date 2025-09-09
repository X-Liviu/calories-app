import { createSelector } from "reselect";

export const selectMeal = (state, weekId, dayId, mealId) =>
  state.weeks
    .find((w) => w.id === weekId)
    ?.days.find((d) => d.id === dayId)
    ?.meals.find((m) => m.id === mealId);

export const selectMealCalories = createSelector(
  [(state, aliments) => aliments],
  (aliments) => {
    if (!aliments || aliments.length === 0) return 0;

    return aliments.reduce(
      (sum, aliment) =>
        sum +
        (aliment.grams *
          (aliment?.user_aliment?.nutrition_facts?.kcal_100g ?? 0)) /
          100,
      0,
    );
  },
);
