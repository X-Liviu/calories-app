import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectWeek } from "../redux/selectors/weekSelectors";
import DayList from "./DayList";
import DayForm from "./DayForm";

const WeekItem = () => {
  const { weekId } = useParams();

  //Como necesito la week para imprimir el número de la semana, recupero con un useSelector desde aquí para poder hacer eso. En WeekSearch, en cambio, ya no hago el useSelector de todas las semanas ahí, si no que se hace en WeekList. (09/09/25)

  const week = useSelector((state) => selectWeek(state, weekId));

  if (!week) return <h1>Loading...</h1>;
  return (
    <>
      <h1>Week {week?.numberWeek}</h1>
      <DayList weekId={week?.id} days={week?.days} />
      <DayForm weekId={week?.id} />
    </>
  );
};

export default WeekItem;
