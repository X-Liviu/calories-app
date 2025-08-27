const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const Week = require("../models/Week");

router.get("/", tokenExtractor, async (req, res, next) => {
  try {
    const weeks = await Week.find({});
    res.json(weeks);
  } catch (err) {
    next(err);
  }
});

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

module.exports = router;
