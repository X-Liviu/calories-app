import { useState } from "react";

import { weekToday } from "../../utils/days";

import WeekList from "./WeekList";
import WeekForm from "./WeekForm";

const WeekSearch = () => {
  const [search, setSearch] = useState("");
  const [showWeekToday, setShowWeekToday] = useState(false);

  return (
    <>
      <form>
        Search your number of the week:{" "}
        <input
          className="input"
          onChange={({ target }) =>
            !isNaN(Number(target.value)) && setSearch(target.value)
          }
          value={search}
        />
      </form>

      {/*<button onClick={weeks?.length === 0 ? get : undefined} type="button">
        Reintentar
      </button>*/}

      <WeekList filter={search} />
      <WeekForm />
      <button onClick={() => setShowWeekToday(!showWeekToday)}>
        Consult the current week
      </button>
      {showWeekToday && <p>Week {weekToday()}</p> /*Esto se puede mejorar */}
    </>
  );
};

export default WeekSearch;
