import { useState } from "react";
import useWeeks from "../../hooks/useWeeks";
import { validateNumberWeek } from "../../utils/validations";
import AddConfirmationModal from "../AddConfirmationModal";
import ErrorMessage from "../ErrorMessage";

const WeekForm = ({ year }) => {
  const [numberWeek, setNumberWeek] = useState("");
  const [weekToAdd, setWeekToAdd] = useState(null);
  const { create } = useWeeks();

  const isValid = validateNumberWeek({ numberWeek, year });

  const handleSubmit = () => {
    if (!isValid) return;
    if (weekToAdd) create(weekToAdd);
    setNumberWeek("");
    setWeekToAdd(null);
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    if (isValid) setWeekToAdd({ numberWeek, year });
  };

  return (
    <>
      <form onSubmit={handleAddClick} className="week-add-form">
        <div className="week-input-wrapper">
          <input
            className="input-field"
            onChange={({ target }) => {
              if (target.value.trim() === "") {
                setNumberWeek("");
                return;
              }
              if (target.value.length <= 2 && !isNaN(Number(target.value))) {
                setNumberWeek(Number(target.value));
              }
            }}
            placeholder="New Week (1 - 53)"
            value={numberWeek}
          />
          {numberWeek === 53 && !isValid && (
            <ErrorMessage message={`Week 53 invalid for ${year}`} />
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`btn btn-primary ${!isValid ? "btn-disabled" : ""}`}
        >
          Add
        </button>
      </form>

      {weekToAdd && (
        <AddConfirmationModal
          onClose={() => setWeekToAdd(null)}
          onConfirm={handleSubmit}
          title="Create Week"
          message={`Create Week ${numberWeek} for year ${year}? You cannot change this later.`}
          confirmText="Yes, Create"
        />
      )}
    </>
  );
};

export default WeekForm;
