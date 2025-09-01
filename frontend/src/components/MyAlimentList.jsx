import { useSelector } from "react-redux";
import MyAlimentItemList from "./MyAlimentItemList";
const MyAlimentList = () => {
  //Cuando se renderiza el MyAlimentForm, se hace un get a /api/my-aliments, por eso ya se puede hacer directamente el useSelector.
  const myAliments = useSelector((state) => state.myAliments);
  //Styling prematuro, sólo para ver un poco mejor el preview de la tabla.
  return (
    <table>
      <thead>
        <td style={{ paddingRight: 50 }}>Name</td>
        <td style={{ paddingRight: 50 }}>Kcal / 100g</td>
        <td style={{ paddingRight: 50 }}>Fat g</td>
        <td style={{ paddingRight: 50 }}>Saturated Fat g</td>
        <td style={{ paddingRight: 50 }}>Carbs g</td>
        <td style={{ paddingRight: 50 }}>Sugars g</td>
        <td style={{ paddingRight: 50 }}>Fiber g</td>
        <td style={{ paddingRight: 50 }}>Protein g</td>
        <td style={{ paddingRight: 50 }}>Salt g</td>
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
