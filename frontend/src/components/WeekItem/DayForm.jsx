import { useState } from "react";

import useDays from "../../hooks/useDays";

import { validateOnlyLetters } from "../../utils/validations";

const DayForm = ({ weekId, isFull }) => {
  const [nameDay, setNameDay] = useState("");
  const { create } = useDays();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateOnlyLetters(nameDay)) return;

    create({ name: nameDay, weekId }); //Crear día en semana específica. Pasar el weekId es clave.
    setNameDay("");
  };

  const isValid = validateOnlyLetters(nameDay);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={({ target }) => setNameDay(target.value)}
          placeholder={isFull ? "Week is full (7/7)" : "Name of the day"}
          value={nameDay}
          disabled={isFull} // Input bloqueado
        />
        <button
          disabled={!isValid || isFull} // Botón bloqueado
          className={`${!isValid || isFull ? "button-disabled" : "button-enabled"}`}
        >
          {isFull ? "Full Week" : "Create Day"}
        </button>
      </form>

      {/* Opcional: Mensaje de error/info */}
      {isFull && <p style={{ color: "orange" }}>Maximum of 7 days reached.</p>}
    </>
  );
};

export default DayForm;
