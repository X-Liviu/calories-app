import { useState } from "react";
import useDays from "../hooks/useDays";
const DayForm = ({ weekId }) => {
  const [nameDay, setNameDay] = useState("");
  const { create } = useDays();
  const handleSubmit = (e) => {
    e.preventDefault();
    create({ name: nameDay, weekId }); //Crear día en semana específica. Pasar el weekId es clave.
    setNameDay("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={({ target }) => setNameDay(target.value)}
          placeholder="Name of the day"
          value={nameDay}
        />
        <button>Create Day</button>
      </form>
    </>
  );
};

export default DayForm;
