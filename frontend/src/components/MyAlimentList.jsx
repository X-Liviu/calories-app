import { useSelector } from "react-redux";
import MyAlimentItemList from "./MyAlimentItemList";

const MyAlimentList = () => {
  //Cuando se renderiza el MyAlimentForm, se hace un get a /api/my-aliments, por eso ya se puede hacer directamente el useSelector.
  const myAliments = useSelector((state) => state.myAliments);
  //Styling prematuro, sólo para ver un poco mejor el preview de la tabla.
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        fontFamily: "Arial, sans-serif",
        marginTop: "1rem",
      }}
    >
      <thead>
        <tr
          style={{
            backgroundColor: "#2bb2d4ff",
            textAlign: "left",
            borderBottom: "2px solid #ddd",
          }}
        >
          <th style={{ padding: "8px 12px" }}>Name</th>
          <th style={{ padding: "8px 12px" }}>Kcal / 100g</th>
          <th style={{ padding: "8px 12px" }}>Fat g</th>
          <th style={{ padding: "8px 12px" }}>Saturated Fat g</th>
          <th style={{ padding: "8px 12px" }}>Carbs g</th>
          <th style={{ padding: "8px 12px" }}>Sugars g</th>
          <th style={{ padding: "8px 12px" }}>Fiber g</th>
          <th style={{ padding: "8px 12px" }}>Protein g</th>
          <th style={{ padding: "8px 12px" }}>Salt g</th>
        </tr>
      </thead>
      <tbody>
        {myAliments.map((al, index) => (
          <MyAlimentItemList
            key={al.id}
            myAliment={al}
            isOdd={index % 2 === 0}
          />
        ))}
      </tbody>
    </table>
  );
};

export default MyAlimentList;
