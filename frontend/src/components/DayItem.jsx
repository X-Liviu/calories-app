import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MealList from "./MealList";
import MealForm from "./MealForm";
const DayItem = () => {
  const { weekId, dayId } = useParams();

  const day = useSelector((state) =>
    state.weeks.find((w) => w.id === weekId)?.days.find((d) => d.id === dayId),
  );
  console.log(day);

  return (
    <>
      <h1>{day.name}</h1>
      <MealList meals={day.meals} weekId={weekId} dayId={dayId} />
      <MealForm weekId={weekId} dayId={dayId} />
    </>
  );
};

export default DayItem;
