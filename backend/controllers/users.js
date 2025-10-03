const router = require("express").Router();
const bcrypt = require("bcrypt");

const { tokenExtractor } = require("../utils/middleware");

const User = require("../models/User");
const { createUserSchema } = require("../utils/validations");

//De momento no se me ocurre por qué necesitaría obtener todos los usuarios pero lo voy a dejar de momento.

/*
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
}); */

router.post("/", async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    await createUserSchema.validateAsync(req.body);

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      username,
      email,
      password_hash: passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", tokenExtractor, async (req, res, next) => {
  try {
    if (req.params.id !== req.userId) {
      const authzError = new Error("invalid username");
      authzError.name = "AuthorizationError";
      throw authzError;
    }

    await User.findOneAndDelete({
      _id: req.userId,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
