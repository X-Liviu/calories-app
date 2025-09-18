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

    const result = aliments.reduce((sumAliments, aliment) => {
      if (aliment.customKcal && !aliment.userAliment) {
        return sumAliments + aliment.customKcal;
      } else if (!aliment.customKcal && aliment.userAliment) {
        return (
          sumAliments +
          (aliment.grams *
            (aliment.userAliment?.nutritionFacts?.kcal100G ?? 0)) /
            100
        );
      } else return sumAliments + 0;
    }, 0);

    return Math.round(result * 100) / 100;
  },
);
