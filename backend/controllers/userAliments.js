const router = require("express").Router();

const UserAliment = require("../models/UserAliment");

const camelToSnake = {
  kcal100G: "kcal_100g",
  fatG: "fat_g",
  saturatedFatG: "saturated_fat_g",
  carbsG: "carbs_g",
  sugarG: "sugar_g",
  fiberG: "fiber_g",
  proteinG: "protein_g",
  saltG: "salt_g",
};

router.get("/", async (req, res, next) => {
  try {
    const aliments = await UserAliment.find({ user: req.userId });
    res.json(aliments);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, nutritionFacts } = req.body;

    const nutrition_facts = {};
    for (const key in nutritionFacts) {
      if (camelToSnake[key]) {
        nutrition_facts[camelToSnake[key]] = nutritionFacts[key];
      }
    }

    const aliment = new UserAliment({
      user: req.userId, //Viene del tokenExtractor
      name,
      nutrition_facts,
    });
    await aliment.save();
    res.status(201).json(aliment);
  } catch (err) {
    next(err);
  }
});

//PUT UserAliment. Change a specific nutrition_fact
router.put(
  "/:userAlimentId",
  async (req, res, next) => {
    try {
      const { userAlimentId } = req.params;
      const clientKey = Object.keys(req.body).find((k) =>
        /*eslint-disable-line */ Object.keys(camelToSnake).includes(k)
      );

      if (!clientKey) return res.status(400).json({ error: "Invalid field" });

      const snakeKey = camelToSnake[clientKey];

      const updatedUserAliment = await UserAliment.findByIdAndUpdate(
        userAlimentId,
        { [`nutrition_facts.${snakeKey}`]: req.body[clientKey] }, //ESTO MUY IMPORTANTE COMO CONOCIMIENTO DE ES6
        { new: true } //eslint-disable-line
      );
      updatedUserAliment.nutrition_facts = {
        ...updatedUserAliment.nutrition_facts,
      }; //Actualizamos referencia para que React-Redux funcione correctamente y se actualice directamente. No sé si esto de verdad sirve.

      res.json(updatedUserAliment);
    } catch (err) {
      next(err);
    }
  } //eslint-disable-line
);

router.delete("/:userAlimentId", async (req, res, next) => {
  try {
    const { userAlimentId } = req.params;
    //const { userId } = req.userId; No sé por qué me dice que es undefined si lo hago de esta manera
    const deletedUserAliment = await UserAliment.findOneAndDelete({
      _id: userAlimentId,
      user: req.userId,
    });
    if (!deletedUserAliment)
      res.status(404).end({ error: "Could not find the aliment to delete it" });

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
