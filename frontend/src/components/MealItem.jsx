import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AlimentList from "./AlimentList";
const MealItem = () => {
  const { weekId, dayId, mealId } = useParams();

  const meal = useSelector((state) =>
    state.weeks
      .find((w) => w.id === weekId)
      ?.days.find((d) => d.id === dayId)
      ?.meals.find((m) => m.id === mealId),
  );

  return (
    <>
      <h1>Day Item Example</h1>
      <AlimentList
        aliments={meal.aliments}
        weekId={weekId}
        dayId={dayId}
        mealId={mealId}
      />
    </>
  );
};

export default MealItem;
