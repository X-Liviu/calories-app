const router = require("express").Router();

const Week = require("../../models/Week");
const Day = require("../../models/Day");

const { daySchema } = require("../../utils/validations");
const { throwNotFound, capitalize } = require("../../utils/helpers");

//POST new Day in Week.
router.post("/:weekId", async (req, res, next) => {
  try {
    const { weekId } = req.params;
    let { name } = req.body;
    name = capitalize(name); //normalized

    await daySchema.validateAsync({ name });

    const week = await Week.findById(weekId);
    if (!week) throwNotFound("Week");

    const day = new Day({
      user: req.userId,
      name,
      week: weekId,
    });
    await day.save(); // El hook se encargará de agregarlo a Week.days

    // AQUÍ VIENE LA CLAVE: devolvemos la semana actualizada y populada, pero de momento no es mi opción favorita de solución. De todos modos, me tendría que haber decantado por una BD Relacional.
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
});

//DELETE Day in Week.
router.delete("/:weekId/:dayId", async (req, res, next) => {
  try {
    const { weekId, dayId } = req.params;

    const week = await Week.findById(weekId);
    if (!week) throwNotFound("Week");

    const deletedDay = await Day.findOneAndDelete({
      user: req.userId,
      week: weekId,
      _id: dayId,
    });

    if (!deletedDay) throwNotFound("Day");
    // El hook en Day se encargará de borrar comidas, alimentos y quitar la referencia de la semana
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
