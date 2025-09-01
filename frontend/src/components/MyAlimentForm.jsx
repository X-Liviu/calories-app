import { useState } from "react";
import useMyAliments from "../hooks/useMyAliments";
import MyAlimentList from "./MyAlimentList";

const INITIAL_STATE = {
  name: "",
  kcal_100g: "",
  fat_g: "",
  saturated_fat_g: "",
  carbs_g: "",
  sugar_g: "",
  fiber_g: "",
  protein_g: "",
  salt_g: "",
};
const MyAlimentForm = () => {
  const [newAliment, setNewAliment] = useState(INITIAL_STATE);
  const { create } = useMyAliments();
  const handleSubmit = (e) => {
    e.preventDefault();
    const newAlimentParsed = {
      name: newAliment.name,
      nutrition_facts: {
        kcal_100g:
          newAliment.kcal_100g === "" ? 0 : Number(newAliment.kcal_100g),
        fat_g: newAliment.fat_g === "" ? 0 : Number(newAliment.fat_g),
        saturated_fat_g:
          newAliment.saturated_fat_g === ""
            ? 0
            : Number(newAliment.saturated_fat_g),
        carbs_g: newAliment.carbs_g === "" ? 0 : Number(newAliment.carbs_g),
        sugar_g: newAliment.sugar_g === "" ? 0 : Number(newAliment.sugar_g),
        fiber_g: newAliment.fiber_g === "" ? 0 : Number(newAliment.fiber_g),
        protein_g:
          newAliment.protein_g === "" ? 0 : Number(newAliment.protein_g),
        salt_g: newAliment.salt_g === "" ? 0 : Number(newAliment.salt_g),
      },
    };
    create(newAlimentParsed);
    setNewAliment(INITIAL_STATE);
  };
  //Importante hacer el spread primero.
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={({ target }) =>
            setNewAliment({
              ...newAliment,
              name: target.value,
            })
          }
          placeholder="Name"
          value={newAliment.name}
        />
        <input
          className="input"
          onChange={({ target }) =>
            setNewAliment({
              ...newAliment,
              kcal_100g: target.value,
            })
          }
          placeholder="Kcal / 100g"
          value={newAliment.kcal_100g}
        />
        <input
          className="input"
          onChange={({ target }) =>
            setNewAliment({
              ...newAliment,
              fat_g: target.value,
            })
          }
          placeholder="Grams of fat"
          value={newAliment.fat_g}
        />
        <input
          className="input"
          onChange={({ target }) =>
            setNewAliment({
              ...newAliment,
              saturated_fat_g: target.value,
            })
          }
          placeholder="Grams of saturated fat"
          value={newAliment.saturated_fat_g}
        />
        <input
          className="input"
          onChange={({ target }) =>
            setNewAliment({
              ...newAliment,
              carbs_g: target.value,
            })
          }
          placeholder="Grams of carbohydrates"
          value={newAliment.carbs_g}
        />
        <input
          className="input"
          onChange={({ target }) =>
            setNewAliment({
              ...newAliment,
              sugar_g: target.value,
            })
          }
          placeholder="Grams of sugars"
          value={newAliment.sugar_g}
        />
        <input
          className="input"
          onChange={({ target }) =>
            setNewAliment({
              ...newAliment,
              fiber_g: target.value,
            })
          }
          placeholder="Grams of fiber"
          value={newAliment.fiber_g}
        />
        <input
          className="input"
          onChange={({ target }) =>
            setNewAliment({
              ...newAliment,
              protein_g: target.value,
            })
          }
          placeholder="Grams of protein"
          value={newAliment.protein_g}
        />
        <input
          className="input"
          onChange={({ target }) =>
            setNewAliment({
              ...newAliment,
              salt_g: target.value,
            })
          }
          placeholder="Grams of salt"
          value={newAliment.salt_g}
        />
        <br />
        <button>Create</button>
      </form>
      <MyAlimentList />
    </>
  );
};

export default MyAlimentForm;
