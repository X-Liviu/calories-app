import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MealList from "./MealList";
const DayItem = () => {
  const { weekId, dayId } = useParams();

  const day = useSelector((state) =>
    state.weeks.find((w) => w.id === weekId)?.days.find((d) => d.id === dayId),
  );
  console.log(day);

  return (
    <>
      <h1>Day Item Example</h1>
      <MealList meals={day.meals} weekId={weekId} dayId={dayId} />
    </>
  );
};

export default DayItem;
