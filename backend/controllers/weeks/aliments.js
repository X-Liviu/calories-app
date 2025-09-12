const router = require("express").Router();

const Week = require("../../models/Week");
const Day = require("../../models/Day");
const Meal = require("../../models/Meal");
const MealAliment = require("../../models/MealAliment");

//POST new MealAliment in Meal.
router.post(
  "/:weekId/:dayId/:mealId",
  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId } = req.params;
      const { name, grams, userAliment, customKcal } = req.body;

      const week = await Week.findById(weekId, "-user").populate({
        path: "days",
        select: "-user",
        populate: {
          path: "meals",
          select: "-user",
        },
      });
      if (!week)
        return res.status(404).json({ error: "Week or day not found" });

      const day = week.days.find((d) => d.id === dayId);
      if (!day) return res.status(404).json({ error: "Day not found" });

      const meal = day.meals.find((m) => m.id === mealId);
      if (!meal) return res.status(404).json({ error: "Meal not found" });

      const aliment = new MealAliment({
        user: req.userId, //Viene del tokenExtractor
        name_snapshot: name,
        grams: grams,
        custom_kcal: customKcal,
        meal: mealId,
        user_aliment: userAliment,
      });
      await aliment.save(); // El hook se encargará de agregarlo a Meal.aliments

      const updatedWeek = await Week.findById(weekId, "-user").populate({
        path: "days",
        select: "-user",
        populate: {
          path: "meals",
          select: "-user",
          populate: {
            path: "aliments",
            select: "-user",
            populate: {
              path: "user_aliment",
              select: "-user",
            },
          },
        },
      });

      res.status(201).json(updatedWeek);
    } catch (err) {
      next(err);
    }
  } //eslint-disable-line
);

//PUT MealAliment. Change grams.
router.put(
  "/:weekId/:dayId/:mealId/:mealAlimentId",
  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId, mealAlimentId } = req.params;
      const { grams } = req.body;

      const week = await Week.findById(weekId, "-user").populate({
        path: "days",
        select: "-user",
        populate: {
          path: "meals",
          select: "-user",
        },
      });
      if (!week)
        return res.status(404).json({ error: "Week or day not found" });

      const day = week.days.find((d) => d.id === dayId);
      if (!day) return res.status(404).json({ error: "Day not found" });

      const meal = day.meals.find((m) => m.id === mealId);
      if (!meal) return res.status(404).json({ error: "Meal not found" });

      await MealAliment.updateOne(
        { _id: mealAlimentId, user: req.userId },
        { grams: grams } //eslint-disable-line
      );

      const updatedWeek = await Week.findById(weekId, "-user").populate({
        path: "days",
        select: "-user",
        populate: {
          path: "meals",
          select: "-user",
          populate: {
            path: "aliments",
            select: "-user",
            populate: {
              path: "user_aliment",
              select: "-user",
            },
          },
        },
      });

      res.json(updatedWeek);
    } catch (err) {
      next(err);
    }
  } //eslint-disable-line
);

//DELETE MealAliment in Meal.
router.delete(
  "/:weekId/:dayId/:mealId/:mealAlimentId",
  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId, mealAlimentId } = req.params;
      const week = await Week.findById(weekId);
      if (!week) res.status(404).json({ error: "Week not found" });

      const day = await Day.findById(dayId);
      if (!day) res.status(404).json({ error: "Day not found" });

      const meal = await Meal.findById(mealId);
      if (!meal) res.status(404).json({ error: "Meal not found" });

      const deletedMealAliment = await MealAliment.findOneAndDelete({
        user: req.userId,
        meal: mealId,
        _id: mealAlimentId,
      });
      if (!deletedMealAliment)
        return res.status(404).json({ error: "Aliment not found" });

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  } //eslint-disable-line
);

module.exports = router;
