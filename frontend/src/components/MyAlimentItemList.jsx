import { useState } from "react";
import useMyAliments from "../hooks/useMyAliments";

const MyAlimentItemList = ({ myAliment }) => {
  const { del, update } = useMyAliments();
  const [editableValues, setEditableValues] = useState({
    ...myAliment.nutritionFacts,
  });
  const [activeInput, setActiveInput] = useState(null); //para quitar cursor del input en el que hemos hecho el submit. Se hace con la propiedad readOnly de input, dependiendo del valor de activeInput.

  const handleSubmit = async (e, key) => {
    e.preventDefault();
    await update({ [key]: Number(editableValues[key]), id: myAliment.id });

    // Desmarcar el input activo
    setActiveInput(null);
  };

  const handleChange = (key, value) => {
    const valueToNumber = Number(value);
    !isNaN(valueToNumber) &&
      setEditableValues({
        ...editableValues,
        [key]: valueToNumber,
      });
  };

  const handleBlur = (key) => {
    setEditableValues({
      ...editableValues,
      [key]: myAliment.nutritionFacts[key],
    });
  };

  const nutritionKeys = Object.keys(myAliment.nutritionFacts);

  return (
    <tr>
      <td>{myAliment.name}</td>

      {nutritionKeys.map((key) => (
        <td key={key}>
          <form onSubmit={(e) => handleSubmit(e, key)}>
            <input
              className="invisible-input"
              value={editableValues[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              onFocus={() => setActiveInput(key)}
              onBlur={() => {
                handleBlur(key);
                setActiveInput(null);
              }}
              readOnly={activeInput !== key} // solo editable si es el input activo
            />
          </form>
        </td>
      ))}

      <td>
        <button onClick={() => del({ id: myAliment.id })}>❌</button>
      </td>
    </tr>
  );
};

export default MyAlimentItemList;
