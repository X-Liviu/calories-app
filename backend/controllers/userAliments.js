const router = require("express").Router();

const UserAliment = require("../models/UserAliment");

router.get("/", async (req, res, next) => {
  try {
    const aliments = await UserAliment.find({ user: req.userId }, "-user");
    res.json(aliments);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, nutrition_facts } = req.body;
    const aliment = new UserAliment({
      user: req.userId, //Viene del tokenExtractor
      name,
      nutrition_facts,
    });
    await aliment.save();
    res.status(201).json(aliment, "id name nutrition_facts");
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
      const keys = Object.keys(req.body);
      const keysToCheck = [
        "kcal_100g",
        "fat_g",
        "saturated_fat_g",
        "carbs_g",
        "fiber_g",
        "protein_g",
        "salt_g",
      ];
      const foundKey = keys.find((k) => keysToCheck.includes(k));

      const updatedUserAliment = await UserAliment.findByIdAndUpdate(
        userAlimentId,
        { [`nutrition_facts.${foundKey}`]: req.body[foundKey] }, //ESTO MUY IMPORTANTE COMO CONOCIMIENTO DE ES6
        { new: true } //eslint-disable-line
      );
      updatedUserAliment.nutrition_facts = {
        ...updatedUserAliment.nutrition_facts,
      }; //Actualizamos referencia para que React-Redux funcione correctamente y se actualice directamente

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
