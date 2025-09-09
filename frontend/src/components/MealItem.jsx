import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AlimentList from "./AlimentList";
import AlimentCatalogSelector from "./AlimentCatalogSelector";
import { selectMeal } from "../redux/selectors/mealSelectors";
const MealItem = () => {
  const { weekId, dayId, mealId } = useParams();

  const meal = useSelector((state) => selectMeal(state, weekId, dayId, mealId));

  return (
    <>
      <h1>{meal.name}</h1>
      <AlimentList
        aliments={meal.aliments}
        weekId={weekId}
        dayId={dayId}
        mealId={mealId}
      />
      <AlimentCatalogSelector weekId={weekId} dayId={dayId} mealId={mealId} />
    </>
  );
};

export default MealItem;
