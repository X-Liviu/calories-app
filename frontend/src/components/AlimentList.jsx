//import useAliments from "../hooks/useAliments";
import AlimentItemList from "./AlimentItemList";
//PROP-DRILLING
const AlimentList = ({ aliments, weekId, dayId, mealId }) => {
  //ESTO SE HA CAMBIADO A AlimentItemList: const { del, update } = useAliments(); //Tiene más sentido hacerlo así creo yo, ya que llamas una vez al custom hook y le pasas la función a cada componente individual. Este componente y WeekList lo hacen de esta manera.

  //Style de la tabla prematuro
  return (
    <table style={{ paddingLeft: 150 }}>
      <tbody>
        {aliments.map((aliment) => {
          return (
            <tr key={aliment.id}>
              <AlimentItemList
                aliment={aliment}
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
