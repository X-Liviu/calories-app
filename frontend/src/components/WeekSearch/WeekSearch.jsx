import { useState } from "react";
import { useSelector } from "react-redux";

import useYear from "../../hooks/useYear";

import { weekToday } from "../../utils/days";

import WeekList from "./WeekList";
import WeekForm from "./WeekForm";

const WeekSearch = () => {
  const user = useSelector((state) => state.user);
  const { currentYear, lastSavedYear } = useSelector((state) => state.year);

  const { update } = useYear();

  const [search, setSearch] = useState("");
  const [showWeekToday, setShowWeekToday] = useState(false);

  const allYears = [];
  for (let i = currentYear; i >= user.since; i--) {
    allYears.push(i);
  }
  return (
    <>
      <select
        className="select"
        value={lastSavedYear}
        onChange={({ target }) => {
          update(Number(target.value));
        }}
      >
        {allYears.map((y) => {
          return <option key={y}>{y}</option>;
        })}
      </select>
      <form>
        Search your number of the week:{" "}
        <input
          className="input"
          onChange={({ target }) => {
            if (target.value.trim() === "") {
              setSearch("");
              return;
            }
            target.value.length <= 2 &&
              !isNaN(Number(target.value)) &&
              setSearch(Number(target.value));
          }}
          value={search}
        />
      </form>

      {/*<button onClick={weeks?.length === 0 ? get : undefined} type="button">
        Reintentar
      </button>*/}

      <WeekList filter={search} />
      <WeekForm year={lastSavedYear} />
      <button onClick={() => setShowWeekToday(!showWeekToday)}>
        Consult the current week
      </button>
      {showWeekToday && <p>Week {weekToday()}</p> /*Esto se puede mejorar */}
    </>
  );
};

export default WeekSearch;
