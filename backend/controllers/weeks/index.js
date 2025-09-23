const router = require("express").Router();
const daysRouter = require("./days");
const mealsRouter = require("./meals");
const alimentsRouter = require("./aliments");

const Week = require("../../models/Week");

//GET all Week, including Day, Meal and MealAliment.
router.get("/", async (req, res, next) => {
  try {
    const weeks = await Week.find({ user: req.userId }).populate({
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
router.delete("/:id", async (req, res, next) => {
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

router.use("/", daysRouter);
router.use("/", mealsRouter);
router.use("/", alimentsRouter);

module.exports = router;
