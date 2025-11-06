import AlimentItemList from "./AlimentItemList";
//PROP-DRILLING
const AlimentList = ({ aliments, weekId, dayId, mealId }) => {
  return (
    <table>
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
