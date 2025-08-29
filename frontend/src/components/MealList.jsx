import { useNavigate } from "react-router-dom";
import MealItemList from "./MealItemList";
const MealList = ({ meals, weekId, dayId }) => {
  const navigate = useNavigate();
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
                  <MealItemList />
                </button>
              </td>
              <td>
                <button>Remove</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MealList;
