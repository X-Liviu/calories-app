import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import useWeeks from "../../hooks/useWeeks";

import {
  selectWeeks,
  selectWeekByNumber,
} from "../../redux/selectors/weekSelectors";

import WeekItemList from "./WeekItemList";

const WeekList = ({ filter }) => {
  const navigate = useNavigate();
  const { del } = useWeeks();
  const filteredWeeks = useSelector((state) =>
    filter !== "" ? selectWeekByNumber(state, filter) : selectWeeks(state),
  );

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
                {!filteredWeeks ? (
                  "Loading"
                ) : filter !== "" ? (
                  <>
                    <strong>{`Week ${filter}`}</strong> was not found.
                  </>
                ) : (
                  "There are no weeks available."
                )}
              </h2>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default WeekList;
