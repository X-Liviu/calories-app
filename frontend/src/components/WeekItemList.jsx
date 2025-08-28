const WeekItemList = ({ week }) => {
  //Cambiar number_week por numberWeek
  return (
    <>
      <h2>Week {week.number_week}</h2>
      <div>
        <strong>
          función que calcule las fechas en las que está la semana comprendida
        </strong>
      </div>
    </>
  );
};

export default WeekItemList;
