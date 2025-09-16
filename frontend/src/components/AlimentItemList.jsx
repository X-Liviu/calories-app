import { useState, useRef } from "react";
import useAliments from "../hooks/useAliments";
import Toggable from "./Toggable";

//TODO arreglar si añado del catálogo, borro el alimento del catálogo, y vuelvo aquí.
const AlimentItemList = ({ aliment, weekId, dayId, mealId }) => {
  //Cambiar name_snapshot por name
  const [visible, setVisible] = useState(false);
  const [editGrams, setEditGrams] = useState("");
  const { del, update } = useAliments();
  const togglableRef = useRef();
  const calculate100g = (nutritionFactGrams) => {
    //De momento me sirve, igual lo cambio en un futuro
    if (nutritionFactGrams === undefined) return "?";

    const result = (nutritionFactGrams * aliment.grams) / 100;
    return Math.round(result * 100) / 100;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    update({
      weekId,
      dayId,
      mealId,
      mealAlimentId: aliment.id,
      grams: Number(editGrams),
    });
    setEditGrams("");
    togglableRef.current.toggleVisibility();
  };
  return (
    <>
      <td>
        <h2>
          {!aliment.user_aliment && aliment.custom_kcal && "⚠️"}{" "}
          {!aliment.user_aliment && !aliment.custom_kcal && "❗"}{" "}
          {aliment.name_snapshot} ({aliment.grams}g):{" "}
          {!aliment.custom_kcal
            ? calculate100g(aliment.user_aliment?.nutrition_facts.kcal_100g)
            : aliment.custom_kcal}{" "}
          kcal
        </h2>
        {visible ? (
          <table>
            <tbody>
              <tr>
                <td>Fats:</td>
                <td>
                  {calculate100g(aliment.user_aliment?.nutrition_facts.fat_g)} g
                </td>
              </tr>
              <tr>
                <td>Saturated Fats:</td>
                <td>
                  {calculate100g(
                    aliment.user_aliment?.nutrition_facts.saturated_fat_g,
                  )}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Carbohydrates:</td>
                <td>
                  {calculate100g(aliment.user_aliment?.nutrition_facts.carbs_g)}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Sugars:</td>
                <td>
                  {calculate100g(aliment.user_aliment?.nutrition_facts.sugar_g)}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Fiber:</td>
                <td>
                  {calculate100g(aliment.user_aliment?.nutrition_facts.fiber_g)}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Protein:</td>
                <td>
                  {calculate100g(
                    aliment.user_aliment?.nutrition_facts.protein_g,
                  )}{" "}
                  g
                </td>
              </tr>
              <tr>
                <td>Salt:</td>
                <td>
                  {calculate100g(aliment.user_aliment?.nutrition_facts.salt_g)}{" "}
                  g
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </td>
      <td>
        {aliment.user_aliment && (
          <button onClick={() => setVisible(!visible)}>ℹ️</button>
        )}
      </td>
      <td>
        {aliment.user_aliment && (
          <Toggable ref={togglableRef} buttonLabel="✏️">
            <form onSubmit={handleSubmit}>
              <input
                onChange={({ target }) => setEditGrams(target.value)}
                value={editGrams}
              />
              <button>Change Grams</button>
            </form>
          </Toggable>
        )}
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
