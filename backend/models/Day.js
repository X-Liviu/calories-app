const mongoose = require("mongoose");
const Meal = require("./Meal");

const daySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  week: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Week",
    required: true,
  },
  meals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
    },
  ],
});

daySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

daySchema.index({ user: 1, week: 1, name: 1 }, { unique: true });

// --- Middleware para borrado en cascada --- por ChatGPT
daySchema.pre("findOneAndDelete", async function (next) {
  try {
    const dayId = this.getQuery()._id;
    const dayDoc = await this.model.findOne(this.getQuery());

    if (!dayId || !dayDoc) return next();

    // Obtenemos todas las comidas de este día
    const meals = await Meal.find({ day: dayId });

    for (const meal of meals) {
      // Eliminamos cada comida (su propio hook borrará MealAliments). Se usa findOneAndDelete porque son capaces de disparar el hook.
      await Meal.findOneAndDelete({ _id: meal._id });
    }

    // --- QUITAR REFERENCIA DEL WEEK ---
    const Week = mongoose.model("Week"); // obtener modelo aquí para evitar circularidad
    await Week.findByIdAndUpdate(dayDoc.week, { $pull: { days: dayId } });

    next();
  } catch (err) {
    next(err);
  }
});

daySchema.post("save", async function (doc, next) {
  try {
    if (!doc.week) return next();

    const Week = mongoose.model("Week"); // obtener modelo aquí para evitar circularidad
    await Week.findByIdAndUpdate(doc.week, { $addToSet: { days: doc._id } });

    next();
  } catch (err) {
    next(err);
  }
});

const Day = mongoose.model("Day", daySchema);
module.exports = Day;
