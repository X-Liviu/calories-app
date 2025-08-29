import { useState } from "react";
import { useSelector } from "react-redux";
import useWeeks from "../hooks/useWeeks";
import WeekList from "./WeekList";
import WeekForm from "./WeekForm";

const WeekSearch = () => {
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
