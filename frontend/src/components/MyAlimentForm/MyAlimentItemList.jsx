import { useState } from "react";
import useMyAliments from "../../hooks/useMyAliments";
import { validateDecimalInput } from "../../utils/validations";

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
    const validatedValue = validateDecimalInput(value);
    if (validatedValue !== null) {
      setEditableValues({
        ...editableValues,
        [key]: validatedValue,
      });
    }
  };

  const handleBlur = (key) => {
    const val = Number(editableValues[key]);
    setEditableValues({
      ...editableValues,
      [key]: isNaN(val) ? 0 : val,
    });
    setActiveInput(null);
  };

  const nutritionKeys = Object.keys(myAliment.nutritionFacts);

  return (
    <tr>
      <td className="cell-name">{myAliment.name}</td>

      {nutritionKeys.map((key) => (
        <td key={key}>
          <form onSubmit={(e) => handleSubmit(e, key)} className="cell-form">
            <input
              type="text"
              inputMode="decimal"
              className="editable-cell-input"
              value={editableValues[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              onFocus={() => setActiveInput(key)}
              onBlur={() => handleBlur(key)}
              readOnly={activeInput !== key}
              title="Click to edit"
              autoComplete="off"
            />
          </form>
        </td>
      ))}

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
