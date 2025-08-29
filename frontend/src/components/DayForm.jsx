import { useState } from "react";
const DayForm = () => {
  const [nameDay, setNameDay] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
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
        <button>Create</button>
      </form>
    </>
  );
};

export default DayForm;
