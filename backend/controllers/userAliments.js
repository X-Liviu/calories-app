const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const UserAliment = require("../models/UserAliment");

router.get("/", tokenExtractor, async (req, res, next) => {
  try {
    const aliments = await UserAliment.find({ user: req.userId });
    res.json(aliments);
  } catch (err) {
    next(err);
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const { name, nutrition_facts } = req.body;
    const aliment = new UserAliment({
      user: req.userId, //Viene del tokenExtractor
      name,
      nutrition_facts,
    });
    await aliment.save();
    res.status(201).json(aliment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
