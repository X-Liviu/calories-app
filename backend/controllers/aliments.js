const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const Aliment = require("../models/Aliment");

router.get("/", tokenExtractor, async (req, res, next) => {
  try {
    const aliments = await Aliment.find({});
    res.json(aliments);
  } catch (err) {
    next(err);
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const { name, mealId, nutritionFacts } = req.body;
    const aliment = new Aliment({
      user: req.userId, //Viene del tokenExtractor
      name,
      meal: mealId,
      nutrition_facts: nutritionFacts,
    });
    await aliment.save();
    res.status(201).json(aliment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
