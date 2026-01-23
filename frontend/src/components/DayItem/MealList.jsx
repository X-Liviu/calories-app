import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useMeals from "../../hooks/useMeals";

import MealItemList from "./MealItemList";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const MealList = ({ meals, weekId, dayId }) => {
  const navigate = useNavigate();
  const { del } = useMeals();

  const [mealToDelete, setMealToDelete] = useState(null);

  const confirmDeleteMeal = () => {
    if (mealToDelete) {
      del({
        weekId,
        dayId,
        mealId: mealToDelete,
      });
      setMealToDelete(null);
    }
  };

  return (
    <>
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
                  <button onClick={() => setMealToDelete(meal.id)}>❌</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {mealToDelete && (
        <DeleteConfirmationModal
          onClose={() => setMealToDelete(null)}
          onConfirm={confirmDeleteMeal}
          title="Delete Meal"
          message="¿Are you sure you want to delete this meal? All aliments included will be erased. This might take a few seconds."
          confirmText="Yes, I confirm."
        />
      )}
    </>
  );
};

export default MealList;
