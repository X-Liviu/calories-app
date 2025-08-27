const mongoose = require("mongoose");

const alimentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meal",
    required: true,
  },
  nutrition_facts: {
    energy_kcal: { type: Number, required: true, default: 0 },
    fat_g: { type: Number, required: true, default: 0 },
    saturated_fat_g: { type: Number, required: true, default: 0 },
    carbs_g: { type: Number, required: true, default: 0 },
    sugar_g: { type: Number, required: true, default: 0 },
    fiber_g: { type: Number, required: true, default: 0 },
    protein_g: { type: Number, required: true, default: 0 },
    salt_g: { type: Number, required: true, default: 0 },
  },
});

alimentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

alimentSchema.index({ user: 1, meal: 1, name: 1 }, { unique: true });

const Aliment = mongoose.model("Aliment", alimentSchema);
module.exports = Aliment;
