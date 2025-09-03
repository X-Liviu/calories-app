// Week.js
const mongoose = require("mongoose");
const Day = require("./Day"); // Importamos Day
//Para ir haciendo la app, de momento solo va a haber semanas únicas de 1 año. Los años están comentados.
const weekSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  number_week: {
    type: Number,
    required: true,
  },
  /*year: {
    type: Number,
    required: true,
  },*/
  days: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Day",
    },
  ],
});

weekSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

weekSchema.index({ user: 1, number_week: 1 /*year: 1*/ }, { unique: true });

// --- Middleware para borrado en cascada --- por ChatGPT
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
