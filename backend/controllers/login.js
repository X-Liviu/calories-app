const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const { loginUserSchema } = require("../utils/validations");
const { ipLimiter, emailLimiter } = require("../utils/middleware");

router.post("/", ipLimiter, emailLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await loginUserSchema.validateAsync(req.body);

    // Consulta optimizada: lean() devuelve un objeto JS plano, no un documento Mongoose.
    // Es más rápido si solo vas a leer datos.
    const user = await User.findOne({ email: email }).lean(); //

    // IMPORTANTE: Como user ahora es un objeto plano por .lean(),
    // accedemos directamente a las propiedades.
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
      id: user._id, // En lean() el _id sigue siendo un objeto ObjectId
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60 * 168 * 2,
    });

    res.json({
      token,
      username: user.username,
      name: user.name,
      since: user.registrationDate.getFullYear(), // CUIDADO: Con lean(), registrationDate es un objeto Date, esto funciona.
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
