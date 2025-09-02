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
    const { weekId } = req.params;
    const { name } = req.body;

    const week = await Week.findById(weekId);
    if (!week) return res.status(404).json({ error: "Week not found" });

    const day = new Day({
      user: req.userId,
      name,
      week: weekId,
    });
    await day.save();

    week.days.push(day._id);
    await week.save();

    // AQUÍ VIENE LA CLAVE: devolvemos la semana actualizada y populada, pero de momento no es mi opción favorita de solución. De todos modos, me tendría que haber decantado por una BD Relacional.
    const updatedWeek = await Week.findById(weekId).populate({
      path: "days",
      populate: {
        path: "meals",
        populate: { path: "aliments" },
      },
    });

    res.status(201).json(updatedWeek);
  } catch (err) {
    next(err);
  }
});

//DELETE Day in Week.
router.delete("/:weekId/:dayId", tokenExtractor, async (req, res, next) => {
  try {
    const { weekId, dayId } = req.params;
    const week = await Week.findById(weekId);
    if (!week) res.status(404).end();
    //Falta comprobar si de verdad hace falta borrar el día (si existe)
    await Day.findOneAndDelete({ user: req.userId, week: weekId, _id: dayId });

    week.days = week.days.filter((d) => d.toString() !== dayId);
    await week.save();

    /*Respuesta de ChatGPT lo más recomendado, pero que yo no conozco:
    await Promise.all([
      Week.updateOne(
        { _id: weekId, user: req.userId },
        { $pull: { days: dayId } }
      ),
      Day.deleteOne({ _id: dayId, user: req.userId, week: weekId })
    ]); */
    res.status(204).end();
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

    const updatedWeek = await Week.findById(weekId).populate({
      path: "days",
      populate: {
        path: "meals",
        populate: { path: "aliments" },
      },
    });

    res.status(201).json(updatedWeek);
  } catch (err) {
    next(err);
  }
});

//DELETE Meal in Day.
router.delete(
  "/:weekId/:dayId/:mealId",
  tokenExtractor,
  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId } = req.params;
      const week = await Week.findById(weekId);
      if (!week) res.status(404).json({ error: "Week not found" });

      const day = await Day.findById(dayId);
      if (!day) res.status(404).json({ error: "Day not found" });
      //Falta comprobar si de verdad hace falta borrar la meal (si existe)
      await Meal.findOneAndDelete({
        user: req.userId,
        day: dayId,
        _id: mealId,
      });

      day.meals = day.meals.filter((m) => m.toString() !== mealId);
      await day.save();
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  } //eslint-disable-line
);

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
