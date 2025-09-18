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
        }, 0),
      0,
    );

    return Math.round(result * 100) / 100;
  },
);
