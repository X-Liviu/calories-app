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

    if (returnedObject.nutrition_facts) {
      const nf = returnedObject.nutrition_facts;
      returnedObject.nutritionFacts = {
        kcal100G: nf.kcal_100g,
        fatG: nf.fat_g,
        saturatedFatG: nf.saturated_fat_g,
        carbsG: nf.carbs_g,
        sugarG: nf.sugar_g,
        fiberG: nf.fiber_g,
        proteinG: nf.protein_g,
        saltG: nf.salt_g,
      };
    }

    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.nutrition_facts;
  },
});

userAlimentSchema.index({ user: 1, name: 1 }, { unique: true });

const UserAliment = mongoose.model("UserAliment", userAlimentSchema);
module.exports = UserAliment;
