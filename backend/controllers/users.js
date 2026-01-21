const router = require("express").Router();
const bcrypt = require("bcrypt");

const { tokenExtractor } = require("../utils/middleware");

const User = require("../models/User");
const { createUserSchema, updateUserSchema } = require("../utils/validations");

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
      registrationDate: new Date(),
    });

    await user.save();
    res.status(201).json({ message: "Registration done correctly" }); //De momento lo dejo así. Igual en un futuro lo cambio. (08-11-25)
  } catch (err) {
    next(err);
  }
});

router.put("/", tokenExtractor, async (req, res, next) => {
  try {
    const validatedData = await updateUserSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    const { name, username, currentPassword, newPassword } = validatedData;

    if (!req.userId) {
      return res.status(401).json({ error: "token missing or invalid" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = { name, username };

    if (newPassword && newPassword.trim() !== "") {
      const passwordCorrect = await bcrypt.compare(
        currentPassword,
        user.password_hash,
      );

      if (!passwordCorrect) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(newPassword, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

router.delete("/", tokenExtractor, async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "token missing or invalid" });
    }
    const userDeleted = await User.findOneAndDelete({ _id: req.userId });

    if (!userDeleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
