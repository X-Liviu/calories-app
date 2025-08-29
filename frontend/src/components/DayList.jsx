import { useNavigate } from "react-router-dom";
import DayItemList from "./DayItemList";
const DayList = ({ days, weekId }) => {
  const navigate = useNavigate();
  return (
    <table>
      <tbody>
        {days.map((day) => {
          return (
            <tr key={day.id}>
              <td>
                <button onClick={() => navigate(`/weeks/${weekId}/${day.id}`)}>
                  <DayItemList />
                </button>
              </td>
              <td>
                <button>Remove</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DayList;
