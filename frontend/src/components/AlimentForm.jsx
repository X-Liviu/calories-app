import { useState } from "react";
import useAliments from "../hooks/useAliments";
const AlimentForm = ({ weekId, dayId, mealId }) => {
  const [nameAliment, setNameAliment] = useState("");
  const [gramsAliment, setGramsAliment] = useState("");
  const [totalKcalAliment, setTotalKcalAliment] = useState("");

  const { create } = useAliments();
  const handleSubmit = (e) => {
    e.preventDefault();
    create({
      name: nameAliment,
      grams: Number(gramsAliment),
      customKcal: Number(totalKcalAliment),
      weekId,
      dayId,
      mealId,
    });
    setNameAliment("");
    setGramsAliment("");
    setTotalKcalAliment("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="name"
        value={nameAliment}
        onChange={({ target }) => setNameAliment(target.value)}
      />
      <input
        className="input"
        placeholder="grams"
        value={gramsAliment}
        onChange={({ target }) => setGramsAliment(target.value)}
      />
      <input
        className="input"
        placeholder="total kcal"
        value={totalKcalAliment}
        onChange={({ target }) => setTotalKcalAliment(target.value)}
      />
      <button>Add Custom Aliment</button>
    </form>
  );
};

export default AlimentForm;
