import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DayList from "./DayList";
import DayForm from "./DayForm";
const WeekItem = () => {
  const { weekId } = useParams();
  const week = useSelector((state) => state.weeks.find((w) => w.id === weekId));

  if (!week) return <h1>Loading...</h1>;
  console.log(week);
  //Cambiar number_week por numberWeek
  return (
    <>
      <h1>Week {week.number_week}</h1>
      <DayList weekId={week.id} days={week.days} />
      <DayForm weekId={weekId} />
    </>
  );
};

export default WeekItem;
