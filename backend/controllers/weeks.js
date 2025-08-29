const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const Week = require("../models/Week");
const Day = require("../models/Day");
const Meal = require("../models/Meal");
const MealAliment = require("../models/MealAliment");

//GET all Week, including Day, Meal and MealAliment.
router.get("/", tokenExtractor, async (req, res, next) => {
  try {
    const weeks = await Week.find({ user: req.userId }).populate({
      path: "days",
      populate: {
        path: "meals",
        populate: {
          path: "aliments",
        },
      },
    });

    res.json(weeks);
  } catch (err) {
    next(err);
  }
});

//POST new Week.
router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const { numberWeek } = req.body;
    const week = new Week({
      user: req.userId, //Viene del tokenExtractor
      number_week: numberWeek,
    });
    await week.save();
    res.status(201).json(week);
  } catch (err) {
    next(err);
  }
});

//DELETE Week.
router.delete("/:id", tokenExtractor, async (req, res, next) => {
  try {
    await Week.findOneAndDelete({
      user: req.userId,
      _id: req.params.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

//POST new Day in Week.
router.post("/:weekId", tokenExtractor, async (req, res, next) => {
  try {
    const weekId = req.params.weekId;
    const { name } = req.body;

    const week = await Week.findById(weekId);
    if (!week) return res.status(404).json({ error: "Week not found" });

    const day = new Day({
      user: req.userId, //Viene del tokenExtractor
      name,
      week: weekId,
    });
    await day.save();

    week.days.push(day._id);
    await week.save();

    res.status(201).json(day);
  } catch (err) {
    next(err);
  }
});

//POST new Meal in Day.
router.post("/:weekId/:dayId", tokenExtractor, async (req, res, next) => {
  try {
    const { weekId, dayId } = req.params;
    const { name } = req.body;

    const week = await Week.findById(weekId).populate({
      path: "days",
    });
    if (!week) return res.status(404).json({ error: "Week not found" });

    const day = week.days.find((d) => d.id === dayId);
    if (!day) return res.status(404).json({ error: "Day not found" });

    const meal = new Meal({
      user: req.userId, //Viene del tokenExtractor
      name,
      day: dayId,
    });
    await meal.save();

    day.meals.push(meal._id);
    await day.save();

    res.status(201).json(meal);
  } catch (err) {
    next(err);
  }
});

//POST new MealAliment in Meal.
router.post(
  "/:weekId/:dayId/:mealId",
  tokenExtractor,
  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId } = req.params;
      const { name } = req.body;

      const week = await Week.findById(weekId).populate({
        path: "days",
        populate: {
          path: "meals",
        },
      });
      if (!week)
        return res.status(404).json({ error: "Week or day not found" });

      const day = week.days.find((d) => d.id === dayId);
      if (!day) return res.status(404).json({ error: "Day not found" });

      const meal = day.meals.find((m) => m.id === mealId);
      if (!meal) return res.status(404).json({ error: "Meal not found" });
      console.log(meal);

      const aliment = new MealAliment({
        user: req.userId, //Viene del tokenExtractor
        name_snapshot: name,
        meal: mealId,
      });
      await aliment.save();

      meal.aliments.push(aliment._id);
      await meal.save();

      res.status(201).json(aliment);
    } catch (err) {
      next(err);
    }
  } //eslint-disable-line
);

module.exports = router;
