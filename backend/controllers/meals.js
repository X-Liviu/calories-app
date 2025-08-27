const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const Meal = require("../models/Meal");

router.get("/", tokenExtractor, async (req, res, next) => {
  try {
    const meals = await Meal.find({});
    res.json(meals);
  } catch (err) {
    next(err);
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const { name, dayId } = req.body;
    const meal = new Meal({
      user: req.userId, //Viene del tokenExtractor
      name,
      day: dayId,
    });
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
