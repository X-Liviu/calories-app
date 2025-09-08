import { useState } from "react";
import { useSelector } from "react-redux";
import useAliments from "../hooks/useAliments";
import useMyAliments from "../hooks/useMyAliments";
const AlimentCatalogSelector = ({ weekId, dayId, mealId }) => {
  let myAliments = useSelector((state) => state.myAliments);
  if (!myAliments) useMyAliments.get();
  myAliments = useSelector((state) => state.myAliments);

  const [grams, setGrams] = useState("");
  const { create } = useAliments();

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectElement = e.target.previousSibling; // el select justo antes del form
    const selectedObject = selectElement.selectedObject;
    console.log(selectedObject);
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
      <select
        onChange={(e) => {
          e.target.selectedObject = myAliments[e.target.selectedIndex];
        }}
      >
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

export default AlimentCatalogSelector;
