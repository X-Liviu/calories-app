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
  const [checked, setChecked] = useState(meal?.cheat);

  //Por si cambian los alimentos del catálogo.
  const myAliments = useSelector((state) => state.myAliments);

  if (!meal) return <h1>Loading...</h1>;

  //Actualizamos los alimentos que vamos a pasar acorde con los posibles cambios que puedan haber sucecido en myAliments. Hay que hacer esto ya que si uso las flechas del navegador para navegar, no se vuelven a montar los componentes, por eso que no se actualiza por sí solo.

  //Esto funciona de la misma manera que en AlimentCatalogSelectorForm.
  const alimentsWithFallback = meal.aliments.map((aliment) => {
    const existsInCatalog = myAliments.some(
      (a) => a.id === aliment.user_aliment?.id,
    );
    return existsInCatalog ? aliment : { ...aliment, user_aliment: null }; // marca como no disponible
  });

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
        aliments={alimentsWithFallback} // <-- usamos la lista “actualizada”
        weekId={weekId}
        dayId={dayId}
        mealId={mealId}
      />
      <br />

      <AlimentForm weekId={weekId} dayId={dayId} mealId={mealId} />
      <br />
      <br />

      <AlimentCatalogSelectorForm
        aliments={alimentsWithFallback} // <-- también aquí
        weekId={weekId}
        dayId={dayId}
        mealId={mealId}
      />
      <h2>{checked && "This is marked as a Cheat Meal. Enjoy! 🍔"}</h2>
    </>
  );
};

export default MealItem;
