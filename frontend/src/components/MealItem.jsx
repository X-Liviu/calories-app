import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useMeals from "../hooks/useMeals";

import { selectMeal } from "../redux/selectors/mealSelectors";

import AlimentList from "./AlimentList";
import AlimentForm from "./AlimentForm";
import AlimentCatalogSelectorForm from "./AlimentCatalogSelectorForm";

const MealItem = () => {
  const { weekId, dayId, mealId } = useParams();
  const meal = useSelector((state) => selectMeal(state, weekId, dayId, mealId));
  const { update } = useMeals();
  const [checked, setChecked] = useState(meal.cheat); //state para guardar el checked

  return (
    <>
      <h1>
        {meal.name}{" "}
        <input
          type="checkbox"
          checked={checked}
          onChange={async ({ target }) => {
            const newValue = target.checked;

            await update({ weekId, dayId, mealId, cheat: newValue });
            setChecked(newValue);
          }}
        />
      </h1>

      <AlimentList
        aliments={meal.aliments}
        weekId={weekId}
        dayId={dayId}
        mealId={mealId}
      />
      <br />

      <AlimentForm weekId={weekId} dayId={dayId} mealId={mealId} />
      <br />
      <br />
      <br />
      <br />

      <AlimentCatalogSelectorForm
        aliments={meal.aliments}
        weekId={weekId}
        dayId={dayId}
        mealId={mealId}
      />
      <h2>
        {
          checked &&
            "This is marked as a Cheat Meal. Enjoy! 🍔" /*Esto es otra forma de renderizado condicional. */
        }
      </h2>
    </>
  );
};

export default MealItem;
