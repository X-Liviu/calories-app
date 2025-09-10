const mongoose = require("mongoose");
const MealAliment = require("./MealAliment");

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cheat: {
    type: Boolean,
    required: true,
    default: false,
  },
  day: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Day",
    required: true,
  },
  aliments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealAliment",
    },
  ],
});

mealSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
mealSchema.index({ user: 1, day: 1, name: 1 }, { unique: true });

// --- Middleware para borrado en cascada --- por ChatGPT
mealSchema.pre("findOneAndDelete", async function (next) {
  try {
    const mealId = this.getQuery()._id;
    const mealDoc = await this.model.findOne(this.getQuery());

    if (!mealId || !mealDoc) return next();

    const aliments = await MealAliment.find({ meal: mealId });

    for (const aliment of aliments) {
      await MealAliment.findOneAndDelete({ _id: aliment._id });
    }

    // --- QUITAR REFERENCIA DEL DAY ---
    const Day = mongoose.model("Day"); // obtener modelo de esta manera para que no haya dependencias circulares.
    await Day.findByIdAndUpdate(mealDoc.day, { $pull: { meals: mealId } });

    next();
  } catch (err) {
    next(err);
  }
});

mealSchema.post("save", async function (doc, next) {
  try {
    if (!doc.day) return next();

    const Day = mongoose.model("Day"); // obtener modelo aquí para evitar circularidad
    await Day.findByIdAndUpdate(doc.day, { $addToSet: { meals: doc._id } });

    next();
  } catch (err) {
    next(err);
  }
});

const Meal = mongoose.model("Meal", mealSchema);
module.exports = Meal;
