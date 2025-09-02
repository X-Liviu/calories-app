import { useSelector } from "react-redux";
import useAliments from "../hooks/useAliments";
import useMyAliments from "../hooks/useMyAliments";
const AlimentCatalogSelector = ({ weekId, dayId, mealId }) => {
  let myAliments = useSelector((state) => state.myAliments);
  if (!myAliments) useMyAliments.get();
  myAliments = useSelector((state) => state.myAliments);

  const { create } = useAliments();

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectElement = e.target.previousSibling; // el select justo antes del form
    const selectedValue = selectElement.value;
    create({ name: selectedValue, weekId, dayId, mealId });
    console.log("Valor seleccionado:", selectedValue);
  };

  return (
    <>
      <select>
        {myAliments.map((a) => (
          <option key={a.name} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>
      <form onSubmit={handleSubmit}>
        <button type="submit">Add Aliment</button>
      </form>
    </>
  );
};

export default AlimentCatalogSelector;
