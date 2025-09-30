import { useState, useRef } from "react";
import useAliments from "../hooks/useAliments";
import Toggable from "./Toggable";

const AlimentItemList = ({ aliment, weekId, dayId, mealId }) => {
  const [visible, setVisible] = useState(false);
  const [editGrams, setEditGrams] = useState("");
  const { del, update } = useAliments();
  const togglableRef = useRef();

  const labels = {
    fatG: "Fats",
    saturatedFatG: "Saturated Fats",
    carbsG: "Carbohydrates",
    sugarG: "Sugars",
    fiberG: "Fiber",
    proteinG: "Protein",
    saltG: "Salt",
  };

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

  //Uso labels como fuente de verdad.
  const nutritionFactKeys = Object.keys(labels).filter(
    (key) => aliment.userAliment?.nutritionFacts[key] !== undefined,
  );
  return (
    <>
      <td>
        <h2>
          {!aliment.userAliment && aliment.customKcal && "⚠️"}{" "}
          {!aliment.userAliment && !aliment.customKcal && "❗"}{" "}
          {aliment.nameSnapshot} ({aliment.grams}g):{" "}
          {!aliment.customKcal
            ? calculate100g(aliment.userAliment?.nutritionFacts.kcal100G)
            : aliment.customKcal}{" "}
          kcal
        </h2>
        {visible /*&& aliment.userAliment*/ && (
          <table>
            <tbody>
              {nutritionFactKeys.map((ntr) => (
                <tr key={ntr}>
                  <td>{labels[ntr]}:</td>
                  <td>
                    {calculate100g(aliment.userAliment.nutritionFacts[ntr])} g
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </td>
      <td>
        {aliment.userAliment && (
          <button onClick={() => setVisible(!visible)}>ℹ️</button>
        )}
      </td>
      <td>
        {aliment.userAliment && (
          <Toggable ref={togglableRef} buttonLabel="✏️">
            <form onSubmit={handleSubmit}>
              <input
                className="input"
                onChange={({ target }) => setEditGrams(target.value)}
                value={editGrams}
                placeholder="grams of aliment"
              />
              <button>✅</button>
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
