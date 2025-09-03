const mongoose = require("mongoose");

const mealAlimentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name_snapshot: {
    type: String,
    required: true,
  },
  grams: {
    type: Number,
    required: true,
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meal",
    required: true,
  },
});

mealAlimentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

mealAlimentSchema.index(
  { user: 1, meal: 1, name_snapshot: 1 },
  { unique: true } //eslint-disable-line
);

mealAlimentSchema.pre("findOneAndDelete", async function (next) {
  try {
    const mealAlimentId = this.getQuery()._id;
    const mealAlimentDoc = await this.model.findOne(this.getQuery());

    if (!mealAlimentId || !mealAlimentDoc) return next();

    // --- QUITAR REFERENCIA DEL MEAL ---
    const Meal = mongoose.model("Meal"); // obtener modelo de esta manera para que no haya dependencias circulares.
    await Meal.findByIdAndUpdate(mealAlimentDoc.meal, {
      $pull: { aliments: mealAlimentId },
    });

    next();
  } catch (err) {
    next(err);
  }
});

mealAlimentSchema.post("save", async function (doc, next) {
  try {
    if (!doc.meal) return next();

    const Meal = mongoose.model("Meal"); // obtener modelo aquí para evitar circularidad
    await Meal.findByIdAndUpdate(doc.meal, {
      $addToSet: { aliments: doc._id },
    });

    next();
  } catch (err) {
    next(err);
  }
});

const MealAliment = mongoose.model("MealAliment", mealAlimentSchema);
module.exports = MealAliment;
