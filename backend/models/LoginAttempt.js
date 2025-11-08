const mongoose = require("mongoose");

const loginAttemptSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  lastAttempt: {
    type: Date,
    required: true,
  },
});

loginAttemptSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

loginAttemptSchema.index({ ip: 1, user: 1 }, { unique: true });

const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);
module.exports = LoginAttempt;
