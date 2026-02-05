import { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useMeals from "../../hooks/useMeals";
import { selectMeal } from "../../redux/selectors/mealSelectors";
import { selectUpdatedAliments } from "../../redux/selectors/myAlimentSelectors";

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

  const updatingRef = useRef(false);

  if (!meal) {
    return (
      <div className="page-loading-container">
        <div className="loader-spinner"></div>
        <h2>Loading meal...</h2>
      </div>
    );
  }

  const handleCheatChange = async (e) => {
    if (updatingRef.current) return;
    const newValue = e.target.checked;

    if (newValue !== meal.cheat) {
      updatingRef.current = true;
      try {
        await update({ weekId, dayId, mealId, cheat: newValue });
      } finally {
        updatingRef.current = false;
      }
    }
  };

  return (
    <div className="page-container">
      <div className="meal-detail-header">
        <h1>{meal.name}</h1>

        <label className="switch-label">
          <input
            type="checkbox"
            className="switch-input"
            checked={meal.cheat}
            onChange={handleCheatChange}
          />
          <span className="switch-slider"></span>
          <span>{meal.cheat ? "Cheat Meal Active" : "Mark as Cheat Meal"}</span>
        </label>
      </div>

      <AlimentList
        aliments={alimentsAvailable}
        weekId={weekId}
        dayId={dayId}
        mealId={mealId}
      />

      <div className="forms-split-container">
        <div className="form-panel">
          <h3>Add from Catalog</h3>
          <AlimentCatalogSelectorForm
            aliments={alimentsAvailable}
            weekId={weekId}
            dayId={dayId}
            mealId={mealId}
          />
        </div>

        <div className="form-panel">
          <h3>Add Custom Aliment</h3>
          <AlimentForm weekId={weekId} dayId={dayId} mealId={mealId} />
        </div>
      </div>
    </div>
  );
};

export default MealItem;
