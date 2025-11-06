import { useState } from "react";

import useWeeks from "../../hooks/useWeeks";

import { validateNumberWeek } from "../../utils/validations";

const WeekForm = () => {
  const [numberWeek, setNumberWeek] = useState("");
  const { create } = useWeeks();
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateNumberWeek(numberWeek);
    if (!isValid) return;

    create({ numberWeek: Number(numberWeek) });
    setNumberWeek("");
  };

  const isValid = validateNumberWeek(numberWeek);

  return (
    <>
      <form className="week-form" onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={({ target }) => {
            !isNaN(Number(target.value)) && setNumberWeek(target.value);
          }}
          placeholder="Week (1 - 52)"
          value={numberWeek}
        />
        <button
          disabled={!isValid}
          className={`${!isValid ? "button-disabled" : "button-enabled"}`}
        >
          Create
        </button>
      </form>
    </>
  );
};

export default WeekForm;
