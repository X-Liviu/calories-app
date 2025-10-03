const router = require("express").Router();

const Week = require("../../models/Week");
const Day = require("../../models/Day");
const Meal = require("../../models/Meal");
const MealAliment = require("../../models/MealAliment");

const { throwNotFound } = require("../../utils/helpers");
const {
  createMealAlimentSchema,
  changeMealAlimentSchema,
} = require("../../utils/validations");

//POST new MealAliment in Meal.
router.post(
  "/:weekId/:dayId/:mealId",
  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId } = req.params;
      const { name, grams, userAliment, customKcal } = req.body;

      await createMealAlimentSchema.validateAsync({
        name,
        grams,
        userAliment,
        customKcal,
      });

      const week = await Week.findById(weekId).populate({
        path: "days",
        populate: {
          path: "meals",
        },
      });
      if (!week) throwNotFound("Week");

      const day = week.days.find((d) => d.id === dayId);
      if (!day) throwNotFound("Day");

      const meal = day.meals.find((m) => m.id === mealId);
      if (!meal) throwNotFound("Meal");

      const aliment = new MealAliment({
        user: req.userId, //Viene del tokenExtractor
        name_snapshot: name,
        grams: grams,
        custom_kcal: customKcal,
        meal: mealId,
        user_aliment: userAliment,
      });
      await aliment.save(); // El hook se encargará de agregarlo a Meal.aliments

      const updatedWeek = await Week.findById(weekId).populate({
        path: "days",
        populate: {
          path: "meals",
          populate: {
            path: "aliments",
            populate: {
              path: "user_aliment",
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

      await changeMealAlimentSchema.validateAsync({ grams });

      const week = await Week.findById(weekId).populate({
        path: "days",
        populate: {
          path: "meals",
        },
      });
      if (!week) throwNotFound("Week");

      const day = week.days.find((d) => d.id === dayId);
      if (!day) throwNotFound("Day");

      const meal = day.meals.find((m) => m.id === mealId);
      if (!meal) throwNotFound("Meal");

      await MealAliment.updateOne(
        { _id: mealAlimentId, user: req.userId },
        { grams: grams } //eslint-disable-line
      );

      const updatedWeek = await Week.findById(weekId).populate({
        path: "days",
        populate: {
          path: "meals",
          populate: {
            path: "aliments",
            populate: {
              path: "user_aliment",
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
      if (!week) throwNotFound("Week");

      const day = await Day.findById(dayId);
      if (!day) throwNotFound("Day");

      const meal = await Meal.findById(mealId);
      if (!meal) throwNotFound("Meal");

      const deletedMealAliment = await MealAliment.findOneAndDelete({
        user: req.userId,
        meal: mealId,
        _id: mealAlimentId,
      });
      if (!deletedMealAliment) throwNotFound("Meal");

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  } //eslint-disable-line
);

module.exports = router;
