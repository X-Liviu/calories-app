const mongoose = require("mongoose");

const userAlimentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nutrition_facts: {
    kcal_100g: { type: Number, required: true, default: 0 },
    fat_g: { type: Number, required: true, default: 0 },
    saturated_fat_g: { type: Number, required: true, default: 0 },
    carbs_g: { type: Number, required: true, default: 0 },
    sugar_g: { type: Number, required: true, default: 0 },
    fiber_g: { type: Number, required: true, default: 0 },
    protein_g: { type: Number, required: true, default: 0 },
    salt_g: { type: Number, required: true, default: 0 },
  },
});

userAlimentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

userAlimentSchema.index({ user: 1, name: 1 }, { unique: true });

const UserAliment = mongoose.model("UserAliment", userAlimentSchema);
module.exports = UserAliment;
