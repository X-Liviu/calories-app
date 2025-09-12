const router = require("express").Router();

const Week = require("../../models/Week");
const Day = require("../../models/Day");
const Meal = require("../../models/Meal");

//POST new Meal in Day.
router.post("/:weekId/:dayId", async (req, res, next) => {
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

//PUT Meal. Change cheat.
router.put(
  "/:weekId/:dayId/:mealId",

  async (req, res, next) => {
    try {
      const { weekId, dayId, mealId } = req.params;
      const { cheat } = req.body;

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

      await Meal.updateOne(
        { _id: mealId, user: req.userId },
        { cheat: cheat } //eslint-disable-line
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

//DELETE Meal in Day.
router.delete(
  "/:weekId/:dayId/:mealId",

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

module.exports = router;
