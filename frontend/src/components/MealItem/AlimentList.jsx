import AlimentItemList from "./AlimentItemList";

const AlimentList = ({ aliments, weekId, dayId, mealId }) => {
  if (!aliments || aliments.length === 0) {
    return (
      <div className="empty-result-container">
        <p>No aliments in this meal yet.</p>
      </div>
    );
  }

  return (
    <div className="aliments-grid">
      {aliments.map((aliment) => (
        <AlimentItemList
          key={aliment.id}
          aliment={aliment}
          weekId={weekId}
          dayId={dayId}
          mealId={mealId}
        />
      ))}
    </div>
  );
};

export default AlimentList;
