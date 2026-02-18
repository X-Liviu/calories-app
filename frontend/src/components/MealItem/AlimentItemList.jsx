import { useState, useRef } from "react";
import useAliments from "../../hooks/useAliments";
import { validateDecimalInput } from "../../utils/validations";

import Toggable from "../Toggable";

const AlimentItemList = ({ aliment, weekId, dayId, mealId }) => {
  const [visible, setVisible] = useState(false);
  const [editGrams, setEditGrams] = useState("");
  const { del, update } = useAliments();
  const togglableRef = useRef();

  const calculate100g = (nutritionFactGrams) => {
    if (nutritionFactGrams === undefined) return "?";
    const result = (nutritionFactGrams * aliment.grams) / 100;
    return Math.round(result * 100) / 100;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    update({
      weekId,
      dayId,
      mealId,
      mealAlimentId: aliment.id,
      grams: Number(editGrams),
    });
    setEditGrams("");
    if (togglableRef.current) togglableRef.current.toggleVisibility();
  };

  const labels = {
    fatG: "Fats",
    saturatedFatG: "Sat. Fats",
    carbsG: "Carbs",
    sugarG: "Sugars",
    fiberG: "Fiber",
    proteinG: "Protein",
    saltG: "Salt",
  };

  const isManual = !!aliment.customKcal;
  const isCatalogItem = !!aliment.userAliment;
  const isDeletedFromCatalog = !isManual && !isCatalogItem;

  const displayKcal = isManual
    ? aliment.customKcal
    : isCatalogItem
      ? calculate100g(aliment.userAliment.nutritionFacts.kcal100G)
      : "???";

  const displayName = aliment.nameSnapshot || aliment.name || "Unknown Aliment";

  const nutritionFactKeys = Object.keys(labels);

  return (
    <div className="aliment-card">
      <div className="aliment-header">
        <div className="aliment-info">
          <div className="aliment-name">{displayName}</div>

          <div className="aliment-meta">
            {!isManual && <span>{aliment.grams}g</span>}

            {isManual && (
              <span
                className="status-icon status-warning"
                title="Added manually (Custom Kcal)"
              >
                ⚠️ Custom Aliment
              </span>
            )}

            {isDeletedFromCatalog && (
              <span
                className="status-icon status-danger"
                title="Item deleted from catalog. Data unavailable."
              >
                ❗ Deleted Data
              </span>
            )}
          </div>
        </div>

        <div className="aliment-actions">
          {isCatalogItem && (
            <button
              className="btn-icon-action"
              onClick={() => setVisible(!visible)}
              title="View Nutrition Facts"
            >
              ℹ️
            </button>
          )}

          <button
            className="btn-delete-icon btn-delete-pos"
            onClick={() =>
              del({ weekId, dayId, mealId, mealAlimentId: aliment.id })
            }
            title="Delete Aliment"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="aliment-stats-row">
        <span className="aliment-kcal-badge">{displayKcal} kcal</span>
      </div>

      {isCatalogItem && (
        <div className="aliment-edit-wrapper">
          <Toggable ref={togglableRef} buttonLabel="Edit Grams">
            <form onSubmit={handleSubmit} className="aliment-edit-form">
              <input
                className="input-field"
                onChange={({ target }) => {
                  const val = validateDecimalInput(target.value);
                  if (val !== null) setEditGrams(val);
                }}
                value={editGrams}
                placeholder="New grams"
                type="text"
                inputMode="decimal"
                autoComplete="off"
              />
              <button className="btn btn-primary btn-compact">✅</button>
            </form>
          </Toggable>
        </div>
      )}

      {visible && isCatalogItem && (
        <div className="nutrition-details">
          <div className="nutrition-grid-compact">
            {nutritionFactKeys.map((ntr) => (
              <div key={ntr} className="nutrition-item">
                <span>{labels[ntr]}:</span>
                <span>
                  {calculate100g(aliment.userAliment.nutritionFacts[ntr])}g
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlimentItemList;
