import { useNavigate } from "react-router-dom";
import useDays from "../hooks/useDays";
import DayItemList from "./DayItemList";
const DayList = ({ days, weekId }) => {
  const navigate = useNavigate();
  const { del } = useDays();
  return (
    <table>
      <tbody>
        {days.map((day) => {
          return (
            <tr key={day.id}>
              <td>
                <button onClick={() => navigate(`/weeks/${weekId}/${day.id}`)}>
                  <DayItemList day={day} />
                </button>
              </td>
              <td>
                <button
                  onClick={
                    () =>
                      del({
                        weekId,
                        dayId: day.id,
                      }) /*Aquí sí que hago distinción de ids, no como en WeekList, ya que aquí hay 2 ids distintos.
                      Además, se intenta siempre que los services no conozcan nada de la API, por eso que en el delete de weekService, lo defines como .id, así para hacer object.id en la URL de la request y que no sepa nada. Aquí pues no se puede, porque si no se volvería demasiado complejo y difícil de entender. Igual después hago cambios para poder manejar / esconder al service estos datos. */
                  }
                >
                  Remove
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DayList;
