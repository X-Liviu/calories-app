import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectDay } from "../redux/selectors/daySelectors";

import MealList from "./MealList";
import MealForm from "./MealForm";

const DayItem = () => {
  const { weekId, dayId } = useParams();

  const day = useSelector((state) => selectDay(state, weekId, dayId));

  return (
    <>
      <h1>{day.name}</h1>
      <MealList meals={day.meals} weekId={weekId} dayId={dayId} />
      <MealForm weekId={weekId} dayId={dayId} />
    </>
  );
};

export default DayItem;
