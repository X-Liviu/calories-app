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
    if (!validateCustomAliment({ nameAliment, gramsAliment, totalKcalAliment }))
      return;

    create({
      name: nameAliment,
      grams: Number(gramsAliment),
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
    <form onSubmit={handleSubmit} className="form-container">
      <input
        className="input-field"
        placeholder="Aliment Name"
        value={nameAliment}
        onChange={({ target }) => setNameAliment(target.value)}
      />
      <input
        className="input-field"
        placeholder="Grams (Optional)"
        value={gramsAliment}
        onChange={({ target }) => {
          if (target.value === "") {
            setGramsAliment("");
            return;
          }
          !isNaN(Number(target.value)) && setGramsAliment(Number(target.value));
        }}
      />
      <input
        className="input-field"
        placeholder="Total Kcal"
        value={totalKcalAliment}
        onChange={({ target }) => {
          if (target.value === "") {
            setTotalKcalAliment("");
            return;
          }
          !isNaN(Number(target.value)) &&
            setTotalKcalAliment(Number(target.value));
        }}
      />

      <button
        type="submit"
        disabled={!isValid}
        className={`btn btn-primary ${!isValid ? "btn-disabled" : ""}`}
        style={{ marginTop: "1rem", width: "100%" }}
      >
        Add Custom Aliment
      </button>
    </form>
  );
};

export default AlimentForm;
