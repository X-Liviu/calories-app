import { useState } from "react";
import { useSelector } from "react-redux";
import { MdSearch } from "react-icons/md";

import useYearManager from "../../hooks/useYearManager";
import { weekToday } from "../../utils/days";
import WeekList from "./WeekList";
import WeekForm from "./WeekForm";

const WeekSearch = () => {
  const user = useSelector((state) => state.user);
  const { currentYear, lastSavedYear } = useSelector((state) => state.year);
  const { changeYear } = useYearManager();

  const [search, setSearch] = useState("");
  const [showWeekToday, setShowWeekToday] = useState(false);

  const allYears = [];
  for (let i = currentYear; i >= user.since; i--) {
    allYears.push(i);
  }

  return (
    <div className="page-container">
      <div className="dashboard-controls">
        <div className="controls-row">
          <div className="control-group">
            <label htmlFor="year-select">Year:</label>
            <select
              id="year-select"
              className="select-field"
              value={lastSavedYear}
              onChange={({ target }) => changeYear(Number(target.value))}
            >
              {allYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Wrapper con el icono y el input modificado */}
          <div className="search-wrapper">
            <MdSearch className="search-icon" />
            <input
              className="input-field input-with-icon"
              placeholder="Search week number..."
              value={search}
              onChange={({ target }) => {
                if (target.value.trim() === "") {
                  setSearch("");
                  return;
                }
                if (target.value.length <= 2 && !isNaN(Number(target.value))) {
                  setSearch(Number(target.value));
                }
              }}
            />
          </div>
        </div>

        <hr className="divider-horizontal" />

        <div className="controls-row">
          <div className="week-form-wrapper">
            <WeekForm year={lastSavedYear} />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowWeekToday(!showWeekToday)}
          >
            {showWeekToday ? "Hide Info" : "Check current week"}
          </button>
        </div>

        {showWeekToday && (
          <div className="current-week-badge">
            You are currently in{" "}
            <strong>
              Week {weekToday()} of the year {currentYear}
            </strong>
          </div>
        )}
      </div>

      <WeekList filter={search} />
    </div>
  );
};

export default WeekSearch;
