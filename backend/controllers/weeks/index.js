const router = require("express").Router();
const daysRouter = require("./days");
const mealsRouter = require("./meals");
const alimentsRouter = require("./aliments");

const Week = require("../../models/Week");

const { weekSchema } = require("../../utils/validations");
const { throwNotFound } = require("../../utils/helpers");

//GET all Week, including Day, Meal and MealAliment.
router.get("/", async (req, res, next) => {
  try {
    const { year } = req.query;
    const queryYear = Number(year);

    if (isNaN(queryYear)) {
      const error = new Error(
        "Year query parameter is required and must be a number",
      );
      error.name = "ValidationError";
      throw error;
    }

    const weeks = await Week.find({
      user: req.userId,
      year: Number(year),
    })
      .sort({ number_week: 1 })
      .populate({
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

    res.json(weeks);
  } catch (err) {
    next(err);
  }
});

//POST new Week.
router.post("/", async (req, res, next) => {
  try {
    await weekSchema.validateAsync(req.body, { abortEarly: false });

    const { numberWeek, year } = req.body;

    const week = new Week({
      user: req.userId, //Viene del tokenExtractor
      number_week: numberWeek,
      year,
    });
    await week.save();

    res.status(201).json(week);
  } catch (err) {
    next(err);
  }
});

//DELETE Week.
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedWeek = await Week.findOneAndDelete({
      user: req.userId,
      _id: req.params.id,
    });

    if (!deletedWeek) throwNotFound("Week");

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.use("/", daysRouter);
router.use("/", mealsRouter);
router.use("/", alimentsRouter);

module.exports = router;
