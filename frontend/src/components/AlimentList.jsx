import useAliments from "../hooks/useAliments";
import AlimentItemList from "./AlimentItemList";
const AlimentList = ({ aliments, weekId, dayId, mealId }) => {
  const { del } = useAliments();
  return (
    <table>
      <tbody>
        {aliments.map((aliment) => {
          return (
            <tr key={aliment.id}>
              <td>
                <AlimentItemList aliment={aliment} />
              </td>
              <td>
                <button>ℹ️</button>
              </td>
              <td>
                <button>✏️</button>
              </td>
              <td>
                <button
                  onClick={() =>
                    del({
                      weekId,
                      dayId,
                      mealId,
                      mealAlimentId: aliment.id,
                    })
                  }
                >
                  ❌
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AlimentList;
