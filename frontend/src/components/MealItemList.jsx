import { useSelector } from "react-redux";
import { selectMealCalories } from "../redux/selectors/mealSelectors";
const MealItemList = ({ meal }) => {
  const totalCalories = useSelector((state) =>
    selectMealCalories(state, meal.aliments),
  );

  return (
    <h2>
      {meal.name}
      <strong> ({totalCalories} kcal)</strong>
    </h2>
  );
};

export default MealItemList;
