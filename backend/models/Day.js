const mongoose = require("mongoose");

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

const Day = mongoose.model("Day", daySchema);
module.exports = Day;
