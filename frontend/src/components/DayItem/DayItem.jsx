import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectDay } from "../../redux/selectors/daySelectors";
import MealList from "./MealList";
import MealForm from "./MealForm";

const DayItem = () => {
  const { weekId, dayId } = useParams();
  const day = useSelector((state) => selectDay(state, weekId, dayId));

  if (!day) {
    return (
      <div className="page-loading-container">
        <div className="loader-spinner"></div>
        <h2>Loading day data...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="day-detail-header">
        <h1>{day.name}</h1>
        <p className="text-muted">Manage your meals for this day</p>
      </div>

      <div className="dashboard-controls">
        <MealForm weekId={weekId} dayId={dayId} />
      </div>

      <MealList meals={day.meals} weekId={weekId} dayId={dayId} />
    </div>
  );
};

export default DayItem;
