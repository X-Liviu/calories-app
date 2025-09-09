import { useSelector } from "react-redux";
import { selectDayCalories } from "../redux/selectors/daySelectors";
const DayItemList = ({ day }) => {
  const totalCalories = useSelector((state) =>
    selectDayCalories(state, day.meals),
  );

  return (
    <h3>
      {day.name} <strong>({totalCalories} kcal)</strong>
    </h3>
  );
};

export default DayItemList;
