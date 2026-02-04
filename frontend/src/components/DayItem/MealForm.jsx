import { useState } from "react";
import useMeals from "../../hooks/useMeals";
import { validateNoEmpty } from "../../utils/validations";

const MealForm = ({ weekId, dayId }) => {
  const [nameMeal, setNameMeal] = useState("");
  const { create } = useMeals();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateNoEmpty(nameMeal)) return;

    create({ name: nameMeal, dayId, weekId });
    setNameMeal("");
  };

  const isValid = validateNoEmpty(nameMeal);

  return (
    <form onSubmit={handleSubmit} className="week-add-form">
      <div className="week-input-wrapper">
        <input
          className="input-field"
          onChange={({ target }) => setNameMeal(target.value)}
          placeholder="Name of the meal (e.g. Breakfast)"
          value={nameMeal}
        />
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`btn btn-primary ${!isValid ? "btn-disabled" : ""}`}
      >
        Add Meal
      </button>
    </form>
  );
};

export default MealForm;
