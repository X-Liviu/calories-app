import { useNavigate } from "react-router-dom";
import WeekItemList from "./WeekItemList";
const WeekList = ({ weeks, filter }) => {
  //Cambiar number_week por numberWeek
  const navigate = useNavigate();
  let filteredWeek;
  if (filter !== "")
    filteredWeek = weeks.find((w) => w.number_week === Number(filter));

  return (
    <table>
      <tbody>
        {filter === "" ? (
          weeks.map((w) => (
            <tr key={w.id}>
              <td>
                <button
                  onClick={() =>
                    navigate(`/weeks/${w.id}`, { state: { week: w } })
                  }
                >
                  <WeekItemList week={w} />
                </button>
              </td>
            </tr>
          ))
        ) : filteredWeek ? (
          <tr key={filteredWeek.id}>
            <td>
              <button
                onClick={() =>
                  navigate(`/weeks/${filteredWeek.id}`, {
                    state: { week: filteredWeek },
                  })
                }
              >
                <WeekItemList week={filteredWeek} />
              </button>
            </td>
          </tr>
        ) : (
          <h2>No se encontró la semana {filter}</h2>
        )}
      </tbody>
    </table>
  );
};

export default WeekList;
