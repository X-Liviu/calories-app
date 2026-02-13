const mongoose = require("mongoose");
const Week = require("./Week");
const UserAliment = require("./UserAliment");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    match: [
      /^(?=.{2,50}$)(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
      "Invalid name format",
    ],
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: [/^[a-zA-Z0-9._-]{3,20}$/, "Invalid username format"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ],
  },
  password_hash: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
});

//Esto no lo uso ya (08-11-2025)
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString();
    }
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password_hash; // El passwordHash no debe mostrarse NUNCA.
    delete returnedObject.registrationDate;
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
