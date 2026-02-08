import { useState } from "react";
import { useSelector } from "react-redux";
import useAliments from "../../hooks/useAliments";
import useMyAliments from "../../hooks/useMyAliments";
import { validateOnlyNumbers } from "../../utils/validations";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectElement = document.getElementById("catalog-select");
    const selectedObject = availableAliments[selectElement.selectedIndex];

    if (!validateOnlyNumbers(grams)) return;

    create({
      name: selectedObject.name,
      grams,
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
          onChange={({ target }) => {
            if (target.value === "") {
              setGrams("");
              return;
            }
            !isNaN(Number(target.value)) && setGrams(Number(target.value));
          }}
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
