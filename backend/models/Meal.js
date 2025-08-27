const mongoose = require("mongoose");

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
  day: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Day",
    required: true,
  },
  aliments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aliment",
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

const Meal = mongoose.model("Meal", mealSchema);
module.exports = Meal;
