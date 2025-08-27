const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const Day = require("../models/Day");

router.get("/", tokenExtractor, async (req, res, next) => {
  try {
    const days = await Day.find({});
    res.json(days);
  } catch (err) {
    next(err);
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const { name, weekId } = req.body;
    const day = new Day({
      user: req.userId, //Viene del tokenExtractor
      name,
      week: weekId,
    });
    await day.save();
    res.status(201).json(day);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
