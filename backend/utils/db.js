const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config");
mongoose.set("strictQuery", false);
console.log("connecting to", MONGODB_URI);

const dbConnection = () => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.error("error connecting to MongoDB:", error.message);
    });
};
module.exports = { dbConnection };
