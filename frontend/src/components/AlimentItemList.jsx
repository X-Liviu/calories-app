import { useState } from "react";

const AlimentItemList = ({ aliment, del, weekId, dayId, mealId }) => {
  //Cambiar name_snapshot por name
  const [visible, setVisible] = useState(false);
  const calculate100g = (grams) => {
    return (grams * aliment.user_aliment.nutrition_facts.kcal_100g) / 100;
  };
  return (
    <>
      <td>
        <h2>
          {aliment.name_snapshot} ({aliment.grams}g):{" "}
          {calculate100g(aliment.grams)} kcal
        </h2>
        {visible ? (
          <table>
            <tbody>
              <tr>
                <td>Fats:</td>
                <td>
                  {calculate100g(aliment.user_aliment.nutrition_facts.fat_g)} g
                </td>
              </tr>
              <tr>
                <td>Saturated Fats:</td>
                <td>
                  {calculate100g(
                    aliment.user_aliment.nutrition_facts.saturated_fat_g,
                  )}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Carbohydrates:</td>
                <td>
                  {calculate100g(aliment.user_aliment.nutrition_facts.carbs_g)}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Sugars:</td>
                <td>
                  {calculate100g(aliment.user_aliment.nutrition_facts.sugar_g)}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Fiber:</td>
                <td>
                  {calculate100g(aliment.user_aliment.nutrition_facts.fiber_g)}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Protein:</td>
                <td>
                  {calculate100g(
                    aliment.user_aliment.nutrition_facts.protein_g,
                  )}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Salt:</td>
                <td>
                  {calculate100g(aliment.user_aliment.nutrition_facts.salt_g)} g
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </td>
      <td>
        <button onClick={() => setVisible(!visible)}>ℹ️</button>
      </td>
      <td>
        <button>✏️</button>
      </td>
      <td>
        <button
          onClick={() =>
            del({
              weekId,
              dayId,
              mealId,
              mealAlimentId: aliment.id,
            })
          }
        >
          ❌
        </button>
      </td>
    </>
  );
};

export default AlimentItemList;
