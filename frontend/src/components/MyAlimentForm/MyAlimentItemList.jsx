import { useState } from "react";
import useMyAliments from "../../hooks/useMyAliments";
import { validateDecimalInput } from "../../utils/validations";

const MyAlimentItemList = ({ myAliment }) => {
  const { del, update } = useMyAliments();

  const [editableValues, setEditableValues] = useState({
    ...myAliment.nutritionFacts,
  });

  const [activeInput, setActiveInput] = useState(null);

  const saveChanges = async (key) => {
    const rawValue = editableValues[key];
    const finalValue = isNaN(Number(rawValue)) ? 0 : Number(rawValue);

    // Si el valor no ha cambiado, no hacemos nada (ahorra petición)
    if (finalValue === myAliment.nutritionFacts[key]) {
      setActiveInput(null);
      return;
    }

    try {
      await update({ [key]: finalValue, id: myAliment.id });
      // El setActiveInput(null) ocurrirá naturalmente por el blur
    } catch (error) {
      console.error("Error updating aliment:", error);
      // Revertimos en caso de error
      setEditableValues({ ...myAliment.nutritionFacts });
    }
    setActiveInput(null);
  };

  // --- MANEJADORES DE EVENTOS ---

  // CASO 1: Al pulsar ENTER
  const handleSubmit = (e) => {
    e.preventDefault();
    // TRUCO: Solo quitamos el foco.
    // Esto disparará automáticamente el evento onBlur de abajo.
    // Así evitamos llamar a saveChanges dos veces.
    document.activeElement.blur();
  };

  // CASO 2: Al hacer clic fuera (BLUR)
  // Este es el ÚNICO lugar que llama a guardar
  const handleBlur = (key) => {
    // Solo guardamos si estábamos editando este campo
    if (activeInput === key) {
      saveChanges(key);
    }
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

  const nutritionKeys = Object.keys(myAliment.nutritionFacts);

  return (
    <tr>
      <td className="cell-name">{myAliment.name}</td>

      {nutritionKeys.map((key) => (
        <td key={key}>
          <form onSubmit={handleSubmit} className="cell-form">
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
