import { useState } from "react";
import useMyAliments from "../../hooks/useMyAliments";
import MyAlimentList from "./MyAlimentList";

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

  return (
    <div className="page-container">
      {/* 1. EL FORMULARIO */}
      <div className="catalog-form-container">
        <h2 className="catalog-form-header">Add New Item to Catalog</h2>

        <form onSubmit={handleSubmit}>
          <div className="catalog-inputs-grid">
            {Object.keys(newAliment).map((key) => (
              <div key={key} className="input-group">
                <label htmlFor={key}>{labels[key]}</label>
                <input
                  id={key}
                  type={key === "name" ? "text" : "number"}
                  step="0.1"
                  className="catalog-input"
                  onChange={({ target }) =>
                    setNewAliment({
                      ...newAliment,
                      [key]: target.value,
                    })
                  }
                  // CORRECCIÓN AQUÍ: Placeholder condicional
                  placeholder={key === "name" ? "Ex: Banana" : "0"}
                  value={newAliment[key]}
                />
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

      {/* 2. LA LISTA */}
      <MyAlimentList />
    </div>
  );
};

export default MyAlimentForm;
