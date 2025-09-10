const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const UserAliment = require("../models/UserAliment");
const User = require("../models/User");

router.get("/", tokenExtractor, async (req, res, next) => {
  try {
    const aliments = await UserAliment.find({ user: req.userId }, "-user");
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
    res.status(201).json(aliment, "id name nutrition_facts");
  } catch (err) {
    next(err);
  }
});

router.delete("/:userAlimentId", tokenExtractor, async (req, res, next) => {
  try {
    const { userAlimentId } = req.params;
    //const { userId } = req.userId; No sé por qué me dice que es undefined si lo hago de esta manera
    const deletedUserAliment = await UserAliment.findOneAndDelete({
      _id: userAlimentId,
      user: req.userId,
    });
    if (!deletedUserAliment)
      res.status(404).end({ error: "Could not find the aliment to delete it" });

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
