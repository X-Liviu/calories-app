import { useLocation } from "react-router-dom";
const WeekItem = () => {
  const location = useLocation();
  const { week } = location.state || {};
  console.log(week);
  //Cambiar number_week por numberWeek
  return (
    <>
      <h1>Week {week.number_week}</h1>
    </>
  );
};

export default WeekItem;
