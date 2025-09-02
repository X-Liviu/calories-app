import { useNavigate } from "react-router-dom";
import AlimentItemList from "./AlimentItemList";
const AlimentList = ({ aliments, weekId, dayId, mealId }) => {
  const navigate = useNavigate();
  return (
    <table>
      <tbody>
        {aliments.map((aliment) => {
          return (
            <tr key={aliment.id}>
              <td>
                <button
                  onClick={() =>
                    navigate(
                      `/weeks/${weekId}/${dayId}/${mealId}/${aliment.id}`,
                    )
                  }
                >
                  <AlimentItemList aliment={aliment} />
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

export default AlimentList;
