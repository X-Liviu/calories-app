import { useState } from "react";
const WeekForm = ({ create }) => {
  const [numberWeek, setNumberWeek] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    create({ numberWeek: Number(numberWeek) });
    setNumberWeek("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
