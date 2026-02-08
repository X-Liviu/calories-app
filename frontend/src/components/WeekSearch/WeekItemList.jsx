import { useSelector } from "react-redux";
import { selectWeekCalories } from "../../redux/selectors/weekSelectors";
import { daysOfIsoWeek } from "../../utils/days";

const WeekItemList = ({ week }) => {
  const totalCalories = useSelector((state) =>
    selectWeekCalories(state, week.days),
  );
  const { lastSavedYear } = useSelector((state) => state.year);
  const days = daysOfIsoWeek(week.numberWeek, lastSavedYear, "DD/MM");

  return (
    <div>
      <div className="week-card-header">
        <h3>Week {week.numberWeek}</h3>
      </div>

      <div className="week-calories-wrapper">
        <span className="week-calories">{totalCalories} kcal</span>
      </div>

      <p className="week-dates">
        ({days[0]} - {days[6]})
      </p>
    </div>
  );
};

export default WeekItemList;
