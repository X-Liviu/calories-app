import { useSelector } from "react-redux";
import { selectWeekCalories } from "../redux/selectors/weekSelectors";

import { daysOfIsoWeek } from "../utils/days";

const WeekItemList = ({ week }) => {
  //Cambiar number_week por numberWeek
  const totalCalories = useSelector((state) =>
    selectWeekCalories(state, week.days),
  );
  const days = daysOfIsoWeek(week.number_week, 2025, "DDMMYYYY");

  return (
    <>
      <h2>
        Week {week.number_week} <strong>({totalCalories} kcal)</strong>
      </h2>
      <p>{`(${days[0]} - ${days[6]})`}</p>
    </>
  );
};

export default WeekItemList;
