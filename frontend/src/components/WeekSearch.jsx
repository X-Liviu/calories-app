import { useState } from "react";
import useWeeks from "../hooks/useWeeks";

import { weekToday } from "../utils/days";

import WeekList from "./WeekList";
import WeekForm from "./WeekForm";

const WeekSearch = () => {
  //Se obtienen las funciones de useWeeks y se pasan como props porque si uso el useWeeks en cada componente por separado, como el useWeeks tiene un useEffect dentro que hace un get a la api de todas las semanas con todos los datos, se haría una sobrecarga innecesaria de llamadas a la api. En cambio, en WeekItem, los subcomponentes que usa, esos mismos llaman individualmente a las funciones del custom hook useDays, porque ese custom hook NO usa un useEffect para hacer un GET automático.
  const { /*get,*/ create, del, loading } = useWeeks();
  const [search, setSearch] = useState("");
  const [showWeekToday, setShowWeekToday] = useState(false);
  return (
    <>
      <form>
        Search your number of the week:{" "}
        <input
          onChange={({ target }) => setSearch(target.value)}
          value={search}
        />
      </form>

      {/*<button onClick={weeks?.length === 0 ? get : undefined} type="button">
        Reintentar
      </button>*/}

      {/*Loading prematuro */}
      {loading ? (
        <h2>Loading your weeks...</h2>
      ) : (
        <WeekList filter={search} del={del} />
      )}
      <WeekForm create={create} />
      <button onClick={() => setShowWeekToday(!showWeekToday)}>
        Consult the current week
      </button>
      {showWeekToday && <p>Week {weekToday()}</p> /*Esto se puede mejorar */}
    </>
  );
};

export default WeekSearch;
