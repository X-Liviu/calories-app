import { useSelector } from "react-redux";
import { selectWeekCalories } from "../redux/selectors/weekSelectors";

const WeekItemList = ({ week }) => {
  //Cambiar number_week por numberWeek
  const totalCalories = useSelector((state) =>
    selectWeekCalories(state, week.id),
  );
  return (
    <>
      <h2>
        Week {week.number_week} <strong>({totalCalories} kcal)</strong>
      </h2>
    </>
  );
};

export default WeekItemList;
