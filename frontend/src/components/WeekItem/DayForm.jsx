import { useState } from "react";

import useDays from "../../hooks/useDays";

import { validateOnlyLetters } from "../../utils/validations";

import AddConfirmationModal from "../AddConfirmationModal";

const DayForm = ({ weekId, isFull }) => {
  const [nameDay, setNameDay] = useState("");
  const [dayToAdd, setDayToAdd] = useState(null);
  const { create } = useDays();

  const handleSubmit = () => {
    if (!validateOnlyLetters(nameDay)) return;
    if (dayToAdd) {
      create(dayToAdd);
    }
    setNameDay("");
    setDayToAdd(null);
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    setDayToAdd({ name: nameDay, weekId }); //Crear día en semana específica. Pasar el weekId es clave.
  };

  const isValid = validateOnlyLetters(nameDay);

  return (
    <>
      <form onSubmit={handleAddClick}>
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
      {dayToAdd && (
        <AddConfirmationModal
          onClose={() => setDayToAdd(null)}
          onConfirm={handleSubmit}
          title="Add Day"
          message="Are you sure you want to add this day? You will not be able to change the name of the day later."
          confirmText="Yes, I confirm."
        />
      )}
    </>
  );
};

export default DayForm;
