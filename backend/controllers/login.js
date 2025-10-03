const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET } = require("../utils/config");

const User = require("../models/User");
const { loginUserSchema } = require("../utils/validations");

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await loginUserSchema.validateAsync(req.body);

    const user = await User.findOne({ email: email });
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(password, user.password_hash);

    if (!(user && passwordCorrect)) {
      const authError = new Error("invalid username or password");
      authError.name = "AuthenticationError";
      throw authError;
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    // el token expira en 14 días.
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60 * 168 * 2,
    });

    res.json({ token, username: user.username, name: user.name });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
