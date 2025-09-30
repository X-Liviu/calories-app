import { useState } from "react";
import useWeeks from "../hooks/useWeeks";
const WeekForm = () => {
  const [numberWeek, setNumberWeek] = useState("");
  const { create } = useWeeks();
  const handleSubmit = (e) => {
    e.preventDefault();
    create({ numberWeek: Number(numberWeek) });
    setNumberWeek("");
  };

  return (
    <>
      <form className="week-form" onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={({ target }) => setNumberWeek(target.value)}
          placeholder="Number of the week"
          value={numberWeek}
        />
        <button>Create</button>
      </form>
    </>
  );
};

export default WeekForm;
