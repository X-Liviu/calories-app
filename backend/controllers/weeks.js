const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const Week = require("../models/Week");
const Day = require("../models/Day");
const Meal = require("../models/Meal");
const MealAliment = require("../models/MealAliment");

//GET all Week, including Day, Meal and MealAliment.
router.get("/", tokenExtractor, async (req, res, next) => {
  try {
    const weeks = await Week.find({ user: req.userId }, "-user").populate({
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

    const week = await Week.findById(weekId, "-user");
    if (!week) return res.status(404).json({ error: "Week not found" });

    const day = new Day({
      user: req.userId,
      name,
      week: weekId,
    });
    await day.save(); // El hook se encargará de agregarlo a Week.days

    // AQUÍ VIENE LA CLAVE: devolvemos la semana actualizada y populada, pero de momento no es mi opción favorita de solución. De todos modos, me tendría que haber decantado por una BD Relacional.
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
});

//DELETE Day in Week.
router.delete("/:weekId/:dayId", tokenExtractor, async (req, res, next) => {
  try {
    const { weekId, dayId } = req.params;

    const week = await Week.findById(weekId);
    if (!week) res.status(404).end();

    const deletedDay = await Day.findOneAndDelete({
      user: req.userId,
      week: weekId,
      _id: dayId,
    });
    if (!deletedDay) return res.status(404).json({ error: "Day not found" });
    // El hook en Day se encargará de borrar comidas, alimentos y quitar la referencia de la semana
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

    const week = await Week.findById(weekId, "-user").populate({
      path: "days",
      select: "-user",
    }); //Este populate es para obtener los días con las ids de los meals, para luego hacer la búsqueda de meal.
    if (!week) return res.status(404).json({ error: "Week not found" });

    const day = week.days.find((d) => d.id === dayId);
    if (!day) return res.status(404).json({ error: "Day not found" });

    const meal = new Meal({
      user: req.userId, //Viene del tokenExtractor
      name,
      day: dayId,
    });
    await meal.save(); // El hook se encargará de agregarlo a Day.meals

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
});

//DELETE Meal in Day.
router.delete(
  "/:weekId/:dayId/:mealId",
  tokenExtractor,
  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId } = req.params;
      const week = await Week.findById(weekId, "-user");
      if (!week) res.status(404).json({ error: "Week not found" });

      const day = await Day.findById(dayId, "-user");
      if (!day) res.status(404).json({ error: "Day not found" });

      const deletedMeal = await Meal.findOneAndDelete({
        user: req.userId,
        day: dayId,
        _id: mealId,
      });
      if (!deletedMeal)
        return res.status(404).json({ error: "Meal not found" });
      // El hook en Meal se encargará de borrar alimentos y quitar la referencia del día
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
      const { name, grams, userAliment } = req.body;

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

//POST new MealAliment in Meal.
router.post(
  "/:weekId/:dayId/:mealId",
  tokenExtractor,
  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId } = req.params;
      const { name, grams, userAliment } = req.body;

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
  tokenExtractor,
  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId, mealAlimentId } = req.params;
      const { grams } = req.body;
      console.log(req.body);

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
  tokenExtractor,
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
