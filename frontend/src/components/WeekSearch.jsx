import { useState } from "react";
import { useSelector } from "react-redux";
import useWeeks from "../hooks/useWeeks";
import WeekList from "./WeekList";
import WeekForm from "./WeekForm";

const WeekSearch = () => {
  //Se obtienen las funciones de useWeeks y se pasan como props porque si uso el useWeeks en cada componente por separado, como el useWeeks tiene un useEffect dentro que hace un get a la api de todas las semanas con todos los datos, se haría una sobrecarga innecesaria de llamadas a la api. En cambio, en WeekItem, los subcomponentes que usa, esos mismos llaman individualmente a las funciones del custom hook useDays, porque ese custom hook NO usa un useEffect para hacer un GET automático.
  const { get, create, del } = useWeeks();
  const [search, setSearch] = useState("");
  const weeks = useSelector((state) => state.weeks);
  console.log(weeks);
  return (
    <>
      <form>
        Search your number of the week:{" "}
        <input
          onChange={({ target }) => setSearch(target.value)}
          value={search}
        />
      </form>
      <button onClick={weeks?.length === 0 ? get : undefined} type="button">
        Reintentar
      </button>

      <WeekList weeks={weeks} filter={search} del={del} />
      <WeekForm create={create} />
    </>
  );
};

export default WeekSearch;
