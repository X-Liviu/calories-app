const AlimentItemList = ({ aliment }) => {
  //Cambiar name_snapshot por name
  return (
    <h2>
      {aliment.name_snapshot} ({aliment.grams}g):
    </h2>
  );
};

export default AlimentItemList;
