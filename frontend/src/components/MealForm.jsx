import { useState } from "react";
import useMeals from "../hooks/useMeals";
const MealForm = ({ weekId, dayId }) => {
  const [nameMeal, setNameMeal] = useState("");
  const { create } = useMeals();
  const handleSubmit = (e) => {
    e.preventDefault();
    create({ name: nameMeal, dayId, weekId });
    setNameMeal("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={({ target }) => setNameMeal(target.value)}
          placeholder="Name of the meal"
          value={nameMeal}
        />
        <button>Create Meal</button>
      </form>
    </>
  );
};

export default MealForm;
