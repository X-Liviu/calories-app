import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectDay } from "../../redux/selectors/daySelectors";
import MealList from "./MealList";
import MealForm from "./MealForm";

const DayItem = () => {
  const { weekId, dayId } = useParams();
  const day = useSelector((state) => selectDay(state, weekId, dayId));

  if (!day) return <h2 className="empty-state">Loading day data...</h2>;

  return (
    <div className="page-container">
      {/* Cabecera del Día */}
      <div className="day-detail-header">
        <h1>{day.name}</h1>
        <p className="text-muted">Manage your meals for this day</p>
      </div>

      {/* Formulario de añadir comida */}
      <div className="dashboard-controls">
        <MealForm weekId={weekId} dayId={dayId} />
      </div>

      {/* Lista de Comidas */}
      <MealList meals={day.meals} weekId={weekId} dayId={dayId} />
    </div>
  );
};

export default DayItem;
