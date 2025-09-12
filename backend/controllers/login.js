const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET } = require("../utils/config");

const User = require("../models/User");

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) res.send(400).end();

    const user = await User.findOne({ email: email });
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(password, user.password_hash);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: "invalid username or password",
      });
    }
    const userForToken = {
      username: user.username,
      id: user._id,
    };

    // el token expira en 14 días.
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60 * 168 * 2,
    });

    res.send({ token, username: user.username, name: user.name });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
