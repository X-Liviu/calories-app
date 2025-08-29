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
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meal",
    required: true,
  },
  /*from_catalog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAliment",
    required: true,
  },*/
});

mealAlimentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

mealAlimentSchema.index({ user: 1, meal: 1, name: 1 }, { unique: true });

const MealAliment = mongoose.model("MealAliment", mealAlimentSchema);
module.exports = MealAliment;
