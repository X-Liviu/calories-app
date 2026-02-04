import { useState } from "react";
import useMyAliments from "../../hooks/useMyAliments";

const MyAlimentItemList = ({ myAliment }) => {
  const { del, update } = useMyAliments();

  const [editableValues, setEditableValues] = useState({
    ...myAliment.nutritionFacts,
  });

  const [activeInput, setActiveInput] = useState(null);

  const handleSubmit = async (e, key) => {
    e.preventDefault();
    await update({ [key]: Number(editableValues[key]), id: myAliment.id });
    setActiveInput(null);
  };

  const handleChange = (key, value) => {
    setEditableValues({
      ...editableValues,
      [key]: value,
    });
  };

  const handleBlur = (key) => {
    setEditableValues({
      ...editableValues,
      [key]: myAliment.nutritionFacts[key],
    });
    setActiveInput(null);
  };

  const nutritionKeys = Object.keys(myAliment.nutritionFacts);

  return (
    <tr>
      {/* CLASE CSS para el nombre (padding y bold) */}
      <td className="cell-name">{myAliment.name}</td>

      {nutritionKeys.map((key) => (
        <td key={key}>
          {/* CLASE CSS para el formulario (height 100%) */}
          <form onSubmit={(e) => handleSubmit(e, key)} className="cell-form">
            <input
              type="number"
              step="0.01"
              className="editable-cell-input"
              value={editableValues[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              onFocus={() => setActiveInput(key)}
              onBlur={() => handleBlur(key)}
              readOnly={activeInput !== key}
              title="Click to edit"
            />
          </form>
        </td>
      ))}

      {/* CLASE CSS para centrar acciones */}
      <td className="cell-center">
        <button
          className="btn-delete-row"
          onClick={() => del({ id: myAliment.id })}
          title="Delete Item"
        >
          ✕
        </button>
      </td>
    </tr>
  );
};

export default MyAlimentItemList;
