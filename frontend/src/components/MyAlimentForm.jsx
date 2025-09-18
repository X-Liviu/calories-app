import { useState } from "react";
import useMyAliments from "../hooks/useMyAliments";
import MyAlimentList from "./MyAlimentList";

const INITIAL_STATE = {
  name: "",
  kcal100G: "",
  fatG: "",
  saturatedFatG: "",
  carbsG: "",
  sugarG: "",
  fiberG: "",
  proteinG: "",
  saltG: "",
};
const MyAlimentForm = () => {
  const [newAliment, setNewAliment] = useState(INITIAL_STATE);
  const { create } = useMyAliments();

  const labels = {
    name: "Name",
    kcal100G: "Kcal / 100g",
    fatG: "Grams of fat",
    saturatedFatG: "Grams of saturated fat",
    carbsG: "Grams of carbohydrates",
    sugarG: "Grams of sugar",
    fiberG: "Grams of fiber",
    proteinG: "Grams of protein",
    saltG: "Grams of salt",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const alimentToCreate = {
      name: newAliment.name,
      nutritionFacts: {
        kcal100G: newAliment.kcal100G === "" ? 0 : Number(newAliment.kcal100G),
        fatG: newAliment.fatG === "" ? 0 : Number(newAliment.fatG),
        saturatedFatG:
          newAliment.saturatedFatG === ""
            ? 0
            : Number(newAliment.saturatedFatG),
        carbsG: newAliment.carbsG === "" ? 0 : Number(newAliment.carbsG),
        sugarG: newAliment.sugarG === "" ? 0 : Number(newAliment.sugarG),
        fiberG: newAliment.fiberG === "" ? 0 : Number(newAliment.fiberG),
        proteinG: newAliment.proteinG === "" ? 0 : Number(newAliment.proteinG),
        saltG: newAliment.saltG === "" ? 0 : Number(newAliment.saltG),
      },
    };
    create(alimentToCreate);
    setNewAliment(INITIAL_STATE);
  };
  //Importante hacer el spread primero.
  return (
    <>
      <form onSubmit={handleSubmit}>
        {Object.keys(newAliment).map((ll) => (
          <input
            key={ll}
            className="input"
            onChange={({ target }) =>
              setNewAliment({
                ...newAliment,
                [ll]: target.value,
              })
            }
            placeholder={labels[ll]}
            value={newAliment[ll]}
          />
        ))}
        <br />
        <button>Create</button>
      </form>
      <MyAlimentList />
    </>
  );
};

export default MyAlimentForm;
