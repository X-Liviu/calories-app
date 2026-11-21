const mongoose = require("mongoose");
const Day = require("./Day");
const weekSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  number_week: {
    type: Number,
    required: true,
    min: 1,
    max: 53,
  },
  year: {
    type: Number,
    required: true,
  },
  days: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Day",
    },
  ],
});

weekSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString();
    }

    if (returnedObject.number_week !== undefined) {
      returnedObject.numberWeek = returnedObject.number_week;
    }

    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.number_week;
    delete returnedObject.user;
  },
});

weekSchema.index({ user: 1, number_week: 1, year: 1 }, { unique: true });

// --- Middleware para borrado en cascada --- X
weekSchema.pre("findOneAndDelete", async function (next) {
  try {
    const weekId = this.getQuery()._id;

    if (!weekId) return next();

    // Obtenemos los días relacionados
    const days = await Day.find({ week: weekId });

    for (const day of days) {
      // Eliminamos cada día (su propio hook borrará Meals y MealAliments)
      await Day.findOneAndDelete({ _id: day._id });
    }

    next();
  } catch (err) {
    next(err);
  }
});

const Week = mongoose.model("Week", weekSchema);
module.exports = Week;
