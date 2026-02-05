import { useSelector } from "react-redux";
import { selectDayCalories } from "../../redux/selectors/daySelectors";

const DayItemList = ({ day }) => {
  const totalCalories = useSelector((state) =>
    selectDayCalories(state, day.meals),
  );

  return (
    <>
      <div className="day-card-title">{day.name}</div>
      <div className="day-card-calories">{totalCalories} kcal</div>
    </>
  );
};

export default DayItemList;
