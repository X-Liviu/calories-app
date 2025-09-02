import { useState } from "react";
import useAliments from "../hooks/useAliments";
const DayForm = ({ weekId, dayId, mealId }) => {
  const [nameAliment, setNameAliment] = useState("");
  const { create } = useAliments();
  const handleSubmit = (e) => {
    e.preventDefault();
    create({ name: nameAliment, weekId, dayId, mealId });
    setNameAliment("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={({ target }) => setNameAliment(target.value)}
          placeholder="Name of the aliment"
          value={nameAliment}
        />
        <button>Create own Aliment</button>
      </form>
    </>
  );
};

export default DayForm;
