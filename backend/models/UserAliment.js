const mongoose = require("mongoose");

const numberRules = {
  type: Number,
  required: true,
  default: 0,
  min: 0,
  max: 10000,
};

const userAlimentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  nutrition_facts: {
    kcal_100g: numberRules,
    fat_g: numberRules,
    saturated_fat_g: numberRules,
    carbs_g: numberRules,
    sugar_g: numberRules,
    fiber_g: numberRules,
    protein_g: numberRules,
    salt_g: numberRules,
  },
});

userAlimentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // 🛡️ BLINDAJE
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString();
    }

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
    delete returnedObject.user; //De momento lo quito, igual en un futuro sí que me sirve. (23/09/25)
  },
});

userAlimentSchema.index({ user: 1, name: 1 }, { unique: true });

const UserAliment = mongoose.model("UserAliment", userAlimentSchema);
module.exports = UserAliment;
