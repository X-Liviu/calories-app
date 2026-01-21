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
  custom_kcal: {
    type: Number,
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meal",
    required: true,
  },
  user_aliment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAliment",
  },
});

mealAlimentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // 🛡️ BLINDAJE 1: Si no hay ID, no intentes convertirlo
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString();
    }

    returnedObject.nameSnapshot = returnedObject.name_snapshot;
    returnedObject.customKcal = returnedObject.custom_kcal;

    // 🛡️ BLINDAJE 2: Gestión segura del populate de user_aliment
    // Si user_aliment se ha populado correctamente, es un objeto.
    // Si no, podría ser un ID o null.
    if (
      returnedObject.user_aliment &&
      typeof returnedObject.user_aliment === "object"
    ) {
      returnedObject.userAliment = returnedObject.user_aliment;
    } else {
      // Si no se pudo popular o es solo un ID, lo dejamos tal cual o null
      returnedObject.userAliment = returnedObject.user_aliment || null;
    }

    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.name_snapshot;
    delete returnedObject.custom_kcal;
    delete returnedObject.user_aliment;
    delete returnedObject.user;
  },
});

mealAlimentSchema.index(
  { user: 1, meal: 1, name_snapshot: 1 },
  { unique: true },
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
