const MyAlimentItemList = ({ myAliment }) => {
  console.log(myAliment);
  return (
    <tr>
      <td>{myAliment.name}</td>
      <td>
        <strong>{myAliment.nutrition_facts.kcal_100g}</strong>
      </td>
      <td>
        <strong>{myAliment.nutrition_facts.fat_g}</strong>
      </td>
      <td>
        <strong>{myAliment.nutrition_facts.saturated_fat_g}</strong>
      </td>
      <td>
        <strong>{myAliment.nutrition_facts.carbs_g}</strong>
      </td>
      <td>
        <strong>{myAliment.nutrition_facts.sugar_g}</strong>
      </td>
      <td>
        <strong>{myAliment.nutrition_facts.fiber_g}</strong>
      </td>
      <td>
        <strong>{myAliment.nutrition_facts.protein_g}</strong>
      </td>
      <td>
        <strong>{myAliment.nutrition_facts.salt_g}</strong>
      </td>
    </tr>
  );
};
export default MyAlimentItemList;
