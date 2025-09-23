import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectWeek } from "../redux/selectors/weekSelectors";
import DayList from "./DayList";
import DayForm from "./DayForm";

const WeekItem = () => {
  const { weekId } = useParams();
  //Si siguiera el mismo esquema de llamadas, el WeekItem es como el weekSearch, que es donde hace uso de useWeeks, por lo tanto, para seguir el mismo esquema, tendría que hacer aquí useDays, para sacar la función de del y pasarle como paramétro a DayList, pero no puedo hacer eso por el custom Hook useWeeks tiene un useEffect que hace un GET a la api de todas las semanas con todos sus datos. Podría hacerlo, pero es innecesario pasarle como props a los componentes DayList y DayForm las funciones del custom hook useDays.

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
