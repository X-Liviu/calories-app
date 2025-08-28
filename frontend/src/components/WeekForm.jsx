import { useState } from "react";
const WeekForm = ({ create }) => {
  const [weekNumber, setWeekNumber] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    create({ number_week: Number(weekNumber) });
    setWeekNumber("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={({ target }) => setWeekNumber(target.value)}
          placeholder="Number of the week"
          value={weekNumber}
        />
        <button>Create</button>
      </form>
    </>
  );
};

export default WeekForm;
