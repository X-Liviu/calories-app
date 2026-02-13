const router = require("express").Router();
const UserAliment = require("../models/UserAliment");
const { throwNotFound } = require("../utils/helpers");
const {
  userAlimentSchema,
  updateUserAlimentSchema,
  catalogNameSchema,
} = require("../utils/validations");

const camelToSnake = {
  kcal100G: "kcal_100g",
  fatG: "fat_g",
  saturatedFatG: "saturated_fat_g",
  carbsG: "carbs_g",
  sugarG: "sugar_g",
  fiberG: "fiber_g",
  proteinG: "protein_g",
  saltG: "salt_g",
};

router.get("/", async (req, res, next) => {
  try {
    const aliments = await UserAliment.find({ user: req.userId });
    res.json(aliments);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, nutritionFacts } = req.body;

    await catalogNameSchema.validateAsync(name, { abortEarly: false });

    if (!nutritionFacts || typeof nutritionFacts !== "object") {
      const error = new Error(
        "nutritionFacts is required and must be an object",
      );
      error.name = "ValidationError";
      throw error;
    }

    await userAlimentSchema.validateAsync(nutritionFacts, {
      abortEarly: false,
    });

    const nutrition_facts = {};

    Object.keys(camelToSnake).forEach((key) => {
      const value = nutritionFacts[key];
      if (value !== undefined && Number.isFinite(Number(value))) {
        nutrition_facts[camelToSnake[key]] = Number(value);
      } else {
        nutrition_facts[camelToSnake[key]] = 0;
      }
    });

    const aliment = new UserAliment({
      user: req.userId, // Viene del tokenExtractor
      name,
      nutrition_facts,
    });

    await aliment.save();
    res.status(201).json(aliment);
  } catch (err) {
    next(err);
  }
});

router.put("/:userAlimentId", async (req, res, next) => {
  try {
    const { userAlimentId } = req.params;

    await updateUserAlimentSchema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    const clientKey = Object.keys(req.body).find((k) =>
      Object.keys(camelToSnake).includes(k),
    );

    if (!clientKey) {
      const error = new Error("Invalid field");
      error.name = "ValidationError";
      throw error;
    }

    const snakeKey = camelToSnake[clientKey];

    const updatedUserAliment = await UserAliment.findOneAndUpdate(
      { _id: userAlimentId, user: req.userId },
      { [`nutrition_facts.${snakeKey}`]: req.body[clientKey] }, //ESTO MUY IMPORTANTE COMO CONOCIMIENTO DE ES6
      {
        new: true,
        runValidators: true,
        context: "query",
      },
    );

    if (!updatedUserAliment) throwNotFound("Aliment");

    updatedUserAliment.nutrition_facts = {
      ...updatedUserAliment.nutrition_facts,
    };

    res.json(updatedUserAliment);
  } catch (err) {
    next(err);
  }
});

router.delete("/:userAlimentId", async (req, res, next) => {
  try {
    const { userAlimentId } = req.params;

    const deletedUserAliment = await UserAliment.findOneAndDelete({
      _id: userAlimentId,
      user: req.userId,
    });

    if (!deletedUserAliment) throwNotFound("Aliment");

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
