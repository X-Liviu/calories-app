import { useState } from "react";

import useWeeks from "../../hooks/useWeeks";

import { validateNumberWeek } from "../../utils/validations";

import AddConfirmationModal from "../AddConfirmationModal";

const WeekForm = ({ year }) => {
  const [numberWeek, setNumberWeek] = useState("");
  const [weekToAdd, setWeekToAdd] = useState(null);

  const { create } = useWeeks();
  const handleSubmit = () => {
    if (!validateNumberWeek({ numberWeek, year })) return;
    if (weekToAdd) {
      create(weekToAdd);
    }
    setNumberWeek("");
    setWeekToAdd(null);
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    setWeekToAdd({ numberWeek, year });
  };

  const isValid = validateNumberWeek({ numberWeek, year });

  return (
    <>
      <form className="week-form" onSubmit={handleAddClick}>
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

      {weekToAdd && (
        <AddConfirmationModal
          onClose={() => setWeekToAdd(null)}
          onConfirm={handleSubmit}
          title="Add Week"
          message="Are you sure you want to add this week? You will not be able to change the number of the week later."
          confirmText="Yes, I confirm."
        />
      )}
    </>
  );
};

export default WeekForm;
