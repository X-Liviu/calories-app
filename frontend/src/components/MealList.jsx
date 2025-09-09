import { useNavigate } from "react-router-dom";
import MealItemList from "./MealItemList";
import useMeals from "../hooks/useMeals";
const MealList = ({ meals, weekId, dayId }) => {
  const navigate = useNavigate();
  const { del } = useMeals();

  return (
    <table>
      <tbody>
        {meals.map((meal) => {
          return (
            <tr key={meal.id}>
              <td>
                <button
                  onClick={() =>
                    navigate(`/weeks/${weekId}/${dayId}/${meal.id}`)
                  }
                >
                  <MealItemList meal={meal} />
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    del({
                      weekId,
                      dayId,
                      mealId: meal.id,
                    })
                  }
                >
                  ❌
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MealList;
