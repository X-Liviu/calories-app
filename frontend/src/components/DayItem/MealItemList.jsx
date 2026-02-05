import { useSelector } from "react-redux";
import { selectMealCalories } from "../../redux/selectors/mealSelectors";

const MealItemList = ({ meal }) => {
  const totalCalories = useSelector((state) =>
    selectMealCalories(state, meal.aliments),
  );

  return (
    <>
      <div className="meal-card-title">{meal.name}</div>
      <div className="meal-card-calories">{totalCalories} kcal</div>
    </>
  );
};

export default MealItemList;
