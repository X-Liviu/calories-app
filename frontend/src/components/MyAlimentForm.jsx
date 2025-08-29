import { useState } from "react";
const INITIAL_STATE = {
  kcal_100g: 0,
  fat_g: 0,
  saturated_fat_g: 0,
  carbs_g: 0,
  sugar_g: 0,
  fiber_g: 0,
  protein_g: 0,
  salt_g: 0,
};
const MyAlimentForm = () => {
  const [newAliment, setNewAliment] = useState(INITIAL_STATE);
  const handleSubmit = (e) => {
    e.preventDefault();
    setNewAliment("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={({ target }) => setNewAliment(target.value)}
          placeholder="Kcal / 100g"
          value={newAliment}
        />
        <input
          className="input"
          onChange={({ target }) => setNewAliment(target.value)}
          placeholder="Grams of fat"
          value={newAliment}
        />
        <input
          className="input"
          onChange={({ target }) => setNewAliment(target.value)}
          placeholder="Grams of saturated fat"
          value={newAliment}
        />
        <input
          className="input"
          onChange={({ target }) => setNewAliment(target.value)}
          placeholder="Grams of carbohydrates"
          value={newAliment}
        />
        <input
          className="input"
          onChange={({ target }) => setNewAliment(target.value)}
          placeholder="Grams of sugars"
          value={newAliment}
        />
        <input
          className="input"
          onChange={({ target }) => setNewAliment(target.value)}
          placeholder="Grams of fiber"
          value={newAliment}
        />
        <input
          className="input"
          onChange={({ target }) => setNewAliment(target.value)}
          placeholder="Grams of protein"
          value={newAliment}
        />
        <input
          className="input"
          onChange={({ target }) => setNewAliment(target.value)}
          placeholder="Grams of salt"
          value={newAliment}
        />
        <br />
        <button>Create</button>
      </form>
    </>
  );
};

export default MyAlimentForm;
