import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useMeals from "../hooks/useMeals";

import { selectMeal } from "../redux/selectors/mealSelectors";
import { selectUpdatedAliments } from "../redux/selectors/myAlimentSelectors";

import AlimentList from "./AlimentList";
import AlimentForm from "./AlimentForm";
import AlimentCatalogSelectorForm from "./AlimentCatalogSelectorForm";

const MealItem = () => {
  const { weekId, dayId, mealId } = useParams();
  const meal = useSelector((state) => selectMeal(state, weekId, dayId, mealId));

  const { update } = useMeals();

  const alimentsAvailable = useSelector((state) =>
    selectUpdatedAliments(state, meal?.aliments),
  );

  if (!meal) return <h1>Loading...</h1>;

  //Solución anterior que sólo revisaba si cambiaban los alimentos, no los valores nutricionales. Ahora se usa un custom selector que se encarga también de eso.

  /*const alimentsAvailable = meal.aliments.map((aliment) => {
    const updatedUserAliment = myAliments.find(
      (a) => a.id === aliment.userAliment?.id,
    );
    return updatedUserAliment
      ? { ...aliment, userAliment: updatedUserAliment }
      : { ...aliment, userAliment: null };
  }); */

  return (
    <>
      <h1>
        {meal?.name}{" "}
        <input
          type="checkbox"
          checked={meal.cheat}
          onChange={async ({ target }) => {
            const newValue = target.checked;
            await update({ weekId, dayId, mealId, cheat: newValue });
          }}
        />
      </h1>

      <AlimentList
        aliments={alimentsAvailable}
        weekId={weekId}
        dayId={dayId}
        mealId={mealId}
      />
      <br />

      <AlimentForm weekId={weekId} dayId={dayId} mealId={mealId} />
      <br />
      <br />

      <AlimentCatalogSelectorForm
        aliments={alimentsAvailable}
        weekId={weekId}
        dayId={dayId}
        mealId={mealId}
      />
      <h2>{meal.cheat && "This is marked as a Cheat Meal. Enjoy! 🍔"}</h2>
    </>
  );
};

export default MealItem;
