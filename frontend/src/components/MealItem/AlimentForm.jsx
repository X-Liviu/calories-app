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
        placeholder="grams"
        value={gramsAliment}
        onChange={({ target }) =>
          !isNaN(Number(target.value)) && setGramsAliment(target.value)
        }
      />
      <input
        className="input"
        placeholder="total kcal"
        value={totalKcalAliment}
        onChange={({ target }) =>
          !isNaN(Number(target.value)) && setTotalKcalAliment(target.value)
        }
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
