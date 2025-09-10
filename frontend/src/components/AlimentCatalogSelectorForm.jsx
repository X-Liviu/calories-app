import { useState } from "react";
import { useSelector } from "react-redux";
import useAliments from "../hooks/useAliments";
import useMyAliments from "../hooks/useMyAliments";
const AlimentCatalogSelectorForm = ({ weekId, dayId, mealId }) => {
  let myAliments = useSelector((state) => state.myAliments);
  if (!myAliments) useMyAliments.get();
  myAliments = useSelector((state) => state.myAliments);
  const [grams, setGrams] = useState("");
  const { create } = useAliments();

  if (myAliments.length === 0)
    return (
      <div>
        <p>No aliments in your catalog.</p>
      </div>
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectElement = e.target.previousSibling; // el select justo antes del form
    const selectedObject = myAliments[selectElement.selectedIndex];

    create({
      name: selectedObject.name,
      grams: Number(grams),
      weekId,
      dayId,
      mealId,
      userAliment: selectedObject.id,
    });
  };

  return (
    <>
      <select>
        {myAliments.map((a) => (
          <option key={a.id} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit}>
        <input
          value={grams}
          placeholder="Grams of the aliment eaten"
          onChange={({ target }) => setGrams(target.value)}
        />
        <button type="submit">Add Aliment</button>
      </form>
    </>
  );
};

export default AlimentCatalogSelectorForm;
