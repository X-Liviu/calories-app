import { useState } from "react";
import { useSelector } from "react-redux";
import useAliments from "../../hooks/useAliments";
import useMyAliments from "../../hooks/useMyAliments";
import { validateOnlyNumbers } from "../../utils/validations";

const AlimentCatalogSelectorForm = ({ aliments, weekId, dayId, mealId }) => {
  // Aseguramos carga de catálogo
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
    // Acceso al select mediante DOM (aunque sería mejor controlled input, mantenemos lógica original por ahora)
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
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "var(--accent)",
          }}
        >
          Select Item:
        </label>
        <select
          id="catalog-select"
          className="select-field"
          style={{ width: "100%" }}
        >
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
          className={`btn btn-primary ${!isValid ? "btn-disabled" : ""}`}
          style={{ marginTop: "1rem", width: "100%" }}
        >
          Add from Catalog
        </button>
      </form>
    </div>
  );
};

export default AlimentCatalogSelectorForm;
