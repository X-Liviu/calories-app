const mongoose = require("mongoose");
const Week = require("./Week");
const UserAliment = require("./UserAliment");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // el passwordHash no debe mostrarse
    delete returnedObject.password_hash;
  },
});

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const userId = this.getQuery()._id;
    if (!userId) return next();

    // Obtenemos las semanas relacionadas
    const weeks = await Week.find({ user: userId });

    for (const week of weeks) {
      // Eliminamos cada semana (su propio hook borrará Days, Meals y MealAliments)
      await Week.findOneAndDelete({ _id: week._id });
    }

    // Obtenemos los días relacionados
    const userAliments = await UserAliment.find({ user: userId });

    for (const userAliment of userAliments) {
      // Eliminamos cada alimento del catálogo.
      await UserAliment.findOneAndDelete({ _id: userAliment._id });
    }

    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
