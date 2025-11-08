import { useState } from "react";

import useWeeks from "../../hooks/useWeeks";

import { validateNumberWeek } from "../../utils/validations";

const WeekForm = ({ year }) => {
  const [numberWeek, setNumberWeek] = useState("");
  const { create } = useWeeks();
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateNumberWeek({ numberWeek, year });
    if (!isValid) return;

    create({ numberWeek, year });
    setNumberWeek("");
  };

  const isValid = validateNumberWeek({ numberWeek, year });

  return (
    <>
      <form className="week-form" onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={({ target }) => {
            if (target.value.trim() === "") {
              setNumberWeek("");
              return;
            }
            target.value.length <= 2 &&
              !isNaN(Number(target.value)) &&
              setNumberWeek(Number(target.value));
          }}
          placeholder="Week (1 - 53)"
          value={numberWeek}
        />
        <button
          disabled={!isValid}
          className={`${!isValid ? "button-disabled" : "button-enabled"}`}
        >
          Create
        </button>
      </form>
      {numberWeek === 53 && !isValid && (
        <p>
          <strong>Note:</strong> A few years have 53 weeks. This week cannot be
          created for {year}.
        </p>
      )}
    </>
  );
};

export default WeekForm;
