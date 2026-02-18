import { useState } from "react";
import { useSelector } from "react-redux";
import useAliments from "../../hooks/useAliments";
import useMyAliments from "../../hooks/useMyAliments";
import {
  validateOnlyNumbers,
  validateDecimalInput,
} from "../../utils/validations";

const AlimentCatalogSelectorForm = ({ aliments, weekId, dayId, mealId }) => {
  let myAliments = useSelector((state) => state.myAliments);
  if (!myAliments) useMyAliments.get();
  myAliments = useSelector((state) => state.myAliments);

  const [grams, setGrams] = useState("");
  const { create } = useAliments();

  const availableAliments = myAliments.filter(
    (myAl) => !aliments.some((a) => a.nameSnapshot === myAl.name),
  );

  if (myAliments.length === 0) {
    return <p className="text-muted">No aliments in your catalog yet.</p>;
  }

  if (availableAliments.length === 0) {
    return (
      <div className="text-muted">
        <p>All catalog items are already in this meal.</p>
      </div>
    );
  }

  const handleGramsChange = (e) => {
    const value = e.target.value;
    const validatedValue = validateDecimalInput(value);

    if (validatedValue !== null) {
      setGrams(validatedValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateOnlyNumbers(grams)) return;

    const selectElement = document.getElementById("catalog-select");
    const selectedObject = availableAliments[selectElement.selectedIndex];

    create({
      name: selectedObject.name,
      grams: Number(grams),
      weekId,
      dayId,
      mealId,
      userAliment: selectedObject.id,
    });
    setGrams("");
  };

  const isValid = validateOnlyNumbers(grams);

  return (
    <div className="form-container">
      <div className="selector-wrapper">
        <label htmlFor="catalog-select" className="selector-label">
          Select Item:
        </label>

        <select id="catalog-select" className="select-field select-full">
          {availableAliments.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="input-field"
          value={grams}
          placeholder="Grams eaten (e.g. 100)"
          type="text"
          onChange={handleGramsChange}
          inputMode="decimal"
          autoComplete="off"
        />

        <button
          disabled={!isValid}
          className={`btn btn-primary btn-submit-block ${!isValid ? "btn-disabled" : ""}`}
        >
          Add from Catalog
        </button>
      </form>
    </div>
  );
};

export default AlimentCatalogSelectorForm;
