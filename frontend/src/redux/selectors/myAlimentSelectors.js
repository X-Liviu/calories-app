import { createSelector } from "reselect";

export const selectUpdatedAliments = createSelector(
  [(state) => state.myAliments, (_, aliments) => aliments],
  (myAliments, aliments) => {
    if (aliments) {
      return aliments.map((aliment) => {
        if (!aliment.userAliment) return aliment;
        const updatedUserAliment = myAliments.find(
          (a) => a.id === aliment.userAliment.id,
        );
        return updatedUserAliment
          ? { ...aliment, userAliment: updatedUserAliment }
          : { ...aliment, userAliment: null };
      });
    }
  },
);
