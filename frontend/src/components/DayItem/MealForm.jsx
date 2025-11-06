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
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={({ target }) => setNameMeal(target.value)}
          placeholder="Name of the meal"
          value={nameMeal}
        />
        <button
          disabled={!isValid}
          className={`${!isValid ? "button-disabled" : "button-enabled"}`}
        >
          Create Meal
        </button>
      </form>
    </>
  );
};

export default MealForm;
