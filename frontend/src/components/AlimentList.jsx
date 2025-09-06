import useAliments from "../hooks/useAliments";
import AlimentItemList from "./AlimentItemList";
//PROP-DRILLING
const AlimentList = ({ aliments, weekId, dayId, mealId }) => {
  const { del, update } = useAliments(); //Tiene más sentido hacerlo así creo yo, ya que llamas una vez al custom hook y le pasas la función a cada componente individual.
  return (
    <table>
      <tbody>
        {aliments.map((aliment) => {
          return (
            <tr key={aliment.id}>
              <AlimentItemList
                aliment={aliment}
                del={del}
                update={update}
                weekId={weekId}
                dayId={dayId}
                mealId={mealId}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AlimentList;
