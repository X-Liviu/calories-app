import { useState } from "react";
import useAliments from "../../hooks/useAliments";
import {
  validateCustomAliment,
  validateDecimalInput,
} from "../../utils/validations";
import { getCounterClass } from "../../utils/helpers";

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
      customKcal: Number(totalKcalAliment),
      weekId,
      dayId,
      mealId,
    });
    setNameAliment("");
    setGramsAliment("");
    setTotalKcalAliment("");
  };

  const handleNameChange = ({ target }) => {
    const value = target.value;
    if (value.length <= 30) {
      setNameAliment(value);
    }
  };

  const handleNumberChange = (e, setFunction) => {
    const value = e.target.value;
    const validatedValue = validateDecimalInput(value);

    if (validatedValue !== null) {
      setFunction(validatedValue);
    }
  };

  const isValid = validateCustomAliment({
    nameAliment,
    gramsAliment,
    totalKcalAliment,
  });

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="input-group">
        <input
          className="input-field"
          placeholder="Aliment Name"
          value={nameAliment}
          type="text"
          onChange={handleNameChange}
          maxLength={30}
        />
        <span className={getCounterClass(nameAliment.length)}>
          {nameAliment.length}/30
        </span>
      </div>

      <input
        className="input-field"
        placeholder="Grams (Optional)"
        value={gramsAliment}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        onChange={(e) => handleNumberChange(e, setGramsAliment)}
      />

      <input
        className="input-field"
        placeholder="Total Kcal"
        value={totalKcalAliment}
        inputMode="decimal"
        autoComplete="off"
        onChange={(e) => handleNumberChange(e, setTotalKcalAliment)}
      />

      <button
        type="submit"
        disabled={!isValid}
        className={`btn btn-primary btn-submit-block ${!isValid ? "btn-disabled" : ""}`}
      >
        Add Custom Aliment
      </button>
    </form>
  );
};

export default AlimentForm;
