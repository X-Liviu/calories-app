const mongoose = require("mongoose");

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

const Week = mongoose.model("Week", weekSchema);
module.exports = Week;
