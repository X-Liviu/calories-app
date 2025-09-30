import { useSelector } from "react-redux";

import MyAlimentItemList from "./MyAlimentItemList";

const MyAlimentList = () => {
  //Cuando se renderiza el MyAlimentForm, se hace un get a /api/my-aliments porque se renderiza App, por eso ya se puede hacer directamente el useSelector.
  const myAliments = useSelector((state) => state.myAliments);
  console.log(myAliments);

  return (
    <table className="my-aliment-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Kcal / 100g</th>
          <th>Fat g</th>
          <th>Saturated Fat g</th>
          <th>Carbs g</th>
          <th>Sugars g</th>
          <th>Fiber g</th>
          <th>Protein g</th>
          <th>Salt g</th>
          <th>REMOVE BUTTON</th>
        </tr>
      </thead>
      <tbody>
        {myAliments.map((al) => (
          <MyAlimentItemList key={al.id} myAliment={al} />
        ))}
      </tbody>
    </table>
  );
};

export default MyAlimentList;
