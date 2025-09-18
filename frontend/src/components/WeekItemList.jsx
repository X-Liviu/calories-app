import { useSelector } from "react-redux";
import { selectWeekCalories } from "../redux/selectors/weekSelectors";

import { daysOfIsoWeek } from "../utils/days";

const WeekItemList = ({ week }) => {
  const totalCalories = useSelector((state) =>
    selectWeekCalories(state, week.days),
  );
  const days = daysOfIsoWeek(week.numberWeek, 2025, "DDMMYYYY");

  return (
    <>
      <h2>
        Week {week.numberWeek} <strong>({totalCalories} kcal)</strong>
      </h2>
      <p>{`(${days[0]} - ${days[6]})`}</p>
    </>
  );
};

export default WeekItemList;
