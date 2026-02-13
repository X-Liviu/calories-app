import { useState } from "react";
import useMyAliments from "../../hooks/useMyAliments";
import MyAlimentList from "./MyAlimentList";
import { validateDecimalInput } from "../../utils/validations";

const INITIAL_STATE = {
  name: "",
  kcal100G: "",
  fatG: "",
  saturatedFatG: "",
  carbsG: "",
  sugarG: "",
  fiberG: "",
  proteinG: "",
  saltG: "",
};

const MyAlimentForm = () => {
  const [newAliment, setNewAliment] = useState(INITIAL_STATE);
  const { create } = useMyAliments();

  const labels = {
    name: "Product Name",
    kcal100G: "Kcal / 100g",
    fatG: "Fat (g)",
    saturatedFatG: "Sat. Fat (g)",
    carbsG: "Carbs (g)",
    sugarG: "Sugars (g)",
    fiberG: "Fiber (g)",
    proteinG: "Protein (g)",
    saltG: "Salt (g)",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const alimentToCreate = {
      name: newAliment.name,
      nutritionFacts: {
        kcal100G: newAliment.kcal100G === "" ? 0 : Number(newAliment.kcal100G),
        fatG: newAliment.fatG === "" ? 0 : Number(newAliment.fatG),
        saturatedFatG:
          newAliment.saturatedFatG === ""
            ? 0
            : Number(newAliment.saturatedFatG),
        carbsG: newAliment.carbsG === "" ? 0 : Number(newAliment.carbsG),
        sugarG: newAliment.sugarG === "" ? 0 : Number(newAliment.sugarG),
        fiberG: newAliment.fiberG === "" ? 0 : Number(newAliment.fiberG),
        proteinG: newAliment.proteinG === "" ? 0 : Number(newAliment.proteinG),
        saltG: newAliment.saltG === "" ? 0 : Number(newAliment.saltG),
      },
    };
    create(alimentToCreate);
    setNewAliment(INITIAL_STATE);
  };

  const handleInputChange = (target, key) => {
    const value = target.value;

    if (key === "name") {
      if (value.length <= 30) {
        setNewAliment({ ...newAliment, [key]: value });
      }
    } else {
      const validatedValue = validateDecimalInput(value);
      if (validatedValue !== null) {
        setNewAliment({ ...newAliment, [key]: validatedValue });
      }
    }
  };

  const getCounterClass = (length) => {
    if (length >= 30) return "input-char-count at-limit";
    if (length >= 25) return "input-char-count near-limit";
    return "input-char-count";
  };

  return (
    <div className="page-container">
      <div className="catalog-form-container">
        <h2 className="catalog-form-header">Add New Item to Catalog</h2>

        <form onSubmit={handleSubmit}>
          <div className="catalog-inputs-grid">
            {Object.keys(newAliment).map((key) => (
              <div key={key} className="input-group">
                <label htmlFor={key}>{labels[key]}</label>
                <input
                  id={key}
                  type="text"
                  inputMode={key === "name" ? "text" : "decimal"}
                  className="catalog-input"
                  onChange={({ target }) => handleInputChange(target, key)}
                  placeholder={key === "name" ? "Ex: Banana" : "0"}
                  value={newAliment[key]}
                  autoComplete="off"
                  maxLength={key === "name" ? 30 : undefined}
                />
                {key === "name" && (
                  <span className={getCounterClass(newAliment.name.length)}>
                    {newAliment.name.length}/30
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="catalog-form-actions">
            <button type="submit" className="btn btn-primary">
              Add to Catalog
            </button>
          </div>
        </form>
      </div>

      <MyAlimentList />
    </div>
  );
};

export default MyAlimentForm;
