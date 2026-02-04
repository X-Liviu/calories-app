import { useState } from "react";
import useDays from "../../hooks/useDays";
import { validateOnlyLetters } from "../../utils/validations";
import AddConfirmationModal from "../AddConfirmationModal";

const DayForm = ({ weekId, isFull }) => {
  const [nameDay, setNameDay] = useState("");
  const [dayToAdd, setDayToAdd] = useState(null);
  const { create } = useDays();

  const handleSubmit = () => {
    if (!validateOnlyLetters(nameDay)) return;
    if (dayToAdd) {
      create(dayToAdd);
    }
    setNameDay("");
    setDayToAdd(null);
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    setDayToAdd({ name: nameDay, weekId });
  };

  const isValid = validateOnlyLetters(nameDay);

  return (
    <>
      <form onSubmit={handleAddClick} className="week-add-form">
        <div className="week-input-wrapper">
          <input
            className="input-field"
            onChange={({ target }) => setNameDay(target.value)}
            placeholder={
              isFull ? "Week is full (7/7)" : "Name of the day (e.g. Monday)"
            }
            value={nameDay}
            disabled={isFull}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || isFull}
          className={`btn btn-primary ${!isValid || isFull ? "btn-disabled" : ""}`}
        >
          {isFull ? "Full" : "Add Day"}
        </button>
      </form>

      {/* Aviso visual con clase CSS */}
      {isFull && (
        <div className="full-week-warning">
          Maximum of 7 days reached. Delete a day to add a new one.
        </div>
      )}

      {dayToAdd && (
        <AddConfirmationModal
          onClose={() => setDayToAdd(null)}
          onConfirm={handleSubmit}
          title="Add Day"
          message={`Create "${nameDay}"? You cannot change the name later.`}
          confirmText="Yes, Create"
        />
      )}
    </>
  );
};

export default DayForm;
