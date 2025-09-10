import useMyAliments from "../hooks/useMyAliments";
const MyAlimentItemList = ({ myAliment, isOdd }) => {
  const { del } = useMyAliments();
  return (
    <tr
      style={{
        backgroundColor: isOdd ? "rgba(197, 181, 57, 1)" : "#ffbf00ff",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <td style={{ padding: "8px 12px" }}>{myAliment.name}</td>
      <td style={{ padding: "8px 12px", fontWeight: "bold" }}>
        {myAliment.nutrition_facts.kcal_100g}
      </td>
      <td style={{ padding: "8px 12px" }}>{myAliment.nutrition_facts.fat_g}</td>
      <td style={{ padding: "8px 12px" }}>
        {myAliment.nutrition_facts.saturated_fat_g}
      </td>
      <td style={{ padding: "8px 12px" }}>
        {myAliment.nutrition_facts.carbs_g}
      </td>
      <td style={{ padding: "8px 12px" }}>
        {myAliment.nutrition_facts.sugar_g}
      </td>
      <td style={{ padding: "8px 12px" }}>
        {myAliment.nutrition_facts.fiber_g}
      </td>
      <td style={{ padding: "8px 12px" }}>
        {myAliment.nutrition_facts.protein_g}
      </td>
      <td style={{ padding: "8px 12px" }}>
        {myAliment.nutrition_facts.salt_g}
      </td>
      <td style={{ padding: "8px 12px" }}>
        <button
          onClick={() => {
            del({ id: myAliment.id });
          }}
        >
          ❌
        </button>
      </td>
    </tr>
  );
};

export default MyAlimentItemList;
