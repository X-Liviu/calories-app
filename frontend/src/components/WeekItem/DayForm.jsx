import { useState } from "react";

import useDays from "../../hooks/useDays";

import { validateOnlyLetters } from "../../utils/validations";

const DayForm = ({ weekId }) => {
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
          placeholder="Name of the day"
          value={nameDay}
        />
        <button
          disabled={!isValid}
          className={`${!isValid ? "button-disabled" : "button-enabled"}`}
        >
          Create Day
        </button>
      </form>
    </>
  );
};

export default DayForm;
