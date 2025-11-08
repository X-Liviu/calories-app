import { useState } from "react";

import useAliments from "../../hooks/useAliments";

import { validateCustomAliment } from "../../utils/validations";

const AlimentForm = ({ weekId, dayId, mealId }) => {
  const [nameAliment, setNameAliment] = useState("");
  const [gramsAliment, setGramsAliment] = useState("");
  const [totalKcalAliment, setTotalKcalAliment] = useState("");

  const { create } = useAliments();
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateCustomAliment({
      nameAliment,
      gramsAliment,
      totalKcalAliment,
    });
    if (!isValid) return;

    create({
      name: nameAliment,
      grams: Number(gramsAliment), //Se convierte a number, por si queda "" porque se deja vacío, entonces se convierte a 0.
      customKcal: totalKcalAliment,
      weekId,
      dayId,
      mealId,
    });
    setNameAliment("");
    setGramsAliment("");
    setTotalKcalAliment("");
  };

  const isValid = validateCustomAliment({
    nameAliment,
    gramsAliment,
    totalKcalAliment,
  });

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
        placeholder="grams (optional)"
        value={gramsAliment}
        onChange={({ target }) => {
          if (target.value.trim() === "") {
            setGramsAliment("");
            return;
          }
          target.value.length <= 5 &&
            !isNaN(Number(target.value)) &&
            setGramsAliment(Number(target.value));
        }}
      />
      <input
        className="input"
        placeholder="total kcal"
        value={totalKcalAliment}
        onChange={({ target }) => {
          if (target.value.trim() === "") {
            setTotalKcalAliment("");
            return;
          }
          target.value.length <= 5 &&
            !isNaN(Number(target.value)) &&
            setTotalKcalAliment(Number(target.value));
        }}
      />
      <button
        disabled={!isValid}
        className={`${!isValid ? "button-disabled" : "button-enabled"}`}
      >
        Add Custom Aliment
      </button>
    </form>
  );
};

export default AlimentForm;
