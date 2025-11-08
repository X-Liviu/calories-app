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

  //Filtros para el select
  const availableAliments = myAliments.filter(
    (myAl) => !aliments.some((a) => a.nameSnapshot === myAl.name),
  );

  if (myAliments.length === 0) {
    return (
      <div>
        <p>No aliments in your catalog.</p>
      </div>
    );
  }

  if (availableAliments.length === 0) {
    return (
      <div>
        <p>
          No more aliments from catalog can be added.
          <br />
          You can add one to the catalog or add one with the form above.
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectElement = e.target.previousSibling; // el select justo antes del form
    const selectedObject = availableAliments[selectElement.selectedIndex]; // usar lista filtrada

    const isValid = validateOnlyNumbers(grams);
    if (!isValid) return;

    create({
      name: selectedObject.name,
      grams,
      weekId,
      dayId,
      mealId,
      userAliment: selectedObject.id,
    });
  };

  const isValid = validateOnlyNumbers(grams);

  return (
    <>
      <select className="select">
        {availableAliments.map((a) => (
          <option key={a.id} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          value={grams}
          placeholder="Grams of the aliment eaten"
          onChange={({ target }) => {
            if (target.value.trim() === "") {
              setGrams("");
              return;
            }
            !isNaN(Number(target.value)) && setGrams(Number(target.value));
          }}
        />
        <button
          disabled={!isValid}
          className={`${!isValid ? "button-disabled" : "button-enabled"}`}
        >
          Add Aliment From Catalog
        </button>
      </form>
    </>
  );
};

export default AlimentCatalogSelectorForm;
