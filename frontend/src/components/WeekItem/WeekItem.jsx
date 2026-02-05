import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectWeek } from "../../redux/selectors/weekSelectors";
import DayList from "./DayList";
import DayForm from "./DayForm";

const WeekItem = () => {
  const { weekId } = useParams();
  const week = useSelector((state) => selectWeek(state, weekId));

  if (!week) {
    return (
      <div className="page-loading-container">
        <div className="loader-spinner"></div>
        <h2>Loading week data...</h2>
      </div>
    );
  }

  const isWeekFull = week.days && week.days.length >= 7;

  return (
    <div className="page-container">
      <div className="week-detail-header">
        <h1>Week {week.numberWeek}</h1>
        <p className="text-muted">Manage your days for this week</p>
      </div>

      <div className="dashboard-controls">
        <DayForm weekId={week.id} isFull={isWeekFull} />
      </div>

      <DayList weekId={week.id} days={week.days} />
    </div>
  );
};

export default WeekItem;
