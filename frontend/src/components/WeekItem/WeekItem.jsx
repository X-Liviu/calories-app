import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectWeek } from "../../redux/selectors/weekSelectors";
import DayList from "./DayList";
import DayForm from "./DayForm";

const WeekItem = () => {
  const { weekId } = useParams();
  //Como necesito la week para imprimir el número de la semana, recupero con un useSelector desde aquí para poder hacer eso. En WeekSearch, en cambio, ya no hago el useSelector de todas las semanas ahí, si no que se hace en WeekList. (09/09/25)
  const week = useSelector((state) => selectWeek(state, weekId));

  if (!week) return <h2 className="empty-state">Loading week data...</h2>;

  const isWeekFull = week.days && week.days.length >= 7;

  return (
    <div className="page-container">
      <div className="week-detail-header">
        <h1>Week {week.numberWeek}</h1>
        <p className="text-muted">Manage your daily meals</p>
      </div>

      <div className="dashboard-controls">
        <DayForm weekId={week.id} isFull={isWeekFull} />
      </div>

      <DayList weekId={week.id} days={week.days} />
    </div>
  );
};

export default WeekItem;
