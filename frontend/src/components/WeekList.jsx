import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useWeeks from "../hooks/useWeeks";
import {
  selectWeeks,
  selectWeekByNumber,
} from "../redux/selectors/weekSelectors";

import WeekItemList from "./WeekItemList";

const WeekList = ({ filter }) => {
  const navigate = useNavigate();
  const { del } = useWeeks();
  const filteredWeeks = useSelector((state) =>
    filter !== ""
      ? selectWeekByNumber(state, Number(filter))
      : selectWeeks(state),
  );

  console.log(filteredWeeks);

  return (
    <table>
      <tbody>
        {filteredWeeks.length > 0 ? (
          filteredWeeks.map((w) => (
            <tr key={w.id}>
              <td>
                <button onClick={() => navigate(`/weeks/${w.id}`)}>
                  <WeekItemList week={w} />
                </button>
              </td>
              <td>
                <button onClick={() => del({ id: w.id })}>❌</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>
              <h2>
                {!filteredWeeks
                  ? "Loading"
                  : filter !== ""
                    ? `No se encontró la semana ${filter}.`
                    : "No hay semanas disponibles."}
              </h2>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default WeekList;
