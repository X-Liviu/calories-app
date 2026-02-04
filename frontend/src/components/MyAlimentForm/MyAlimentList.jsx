import { useSelector } from "react-redux";
import MyAlimentItemList from "./MyAlimentItemList";

const MyAlimentList = () => {
  const myAliments = useSelector((state) => state.myAliments);

  return (
    // CLASE CSS para el contenedor ancho
    <div className="catalog-list-container">
      <h3 className="catalog-list-title">
        Your Catalog ({myAliments.length} items)
      </h3>

      <div className="table-responsive-wrapper">
        <table className="catalog-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Kcal / 100g</th>
              <th>Fat</th>
              <th>Sat. Fat</th>
              <th>Carbs</th>
              <th>Sugars</th>
              <th>Fiber</th>
              <th>Protein</th>
              <th>Salt</th>
              {/* CLASE CSS para centrar */}
              <th className="cell-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myAliments.map((al) => (
              <MyAlimentItemList key={al.id} myAliment={al} />
            ))}

            {myAliments.length === 0 && (
              <tr>
                {/* CLASE CSS para mensaje vacío */}
                <td colSpan="10" className="catalog-empty-message">
                  No items in catalog yet. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAlimentList;
