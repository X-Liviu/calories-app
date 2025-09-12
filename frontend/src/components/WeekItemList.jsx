import { useSelector } from "react-redux";
import { selectWeekCalories } from "../redux/selectors/weekSelectors";

const WeekItemList = ({ week }) => {
  //Cambiar number_week por numberWeek
  const totalCalories = useSelector((state) =>
    selectWeekCalories(state, week.days),
  );
  return (
    <>
      <h2>
        Week {week.number_week} <strong>({totalCalories} kcal)</strong>
      </h2>
      <p>(semana en concreto: ejemplo -- 25/08/25 - 31/08/25)</p>
    </>
  );
};

export default WeekItemList;
