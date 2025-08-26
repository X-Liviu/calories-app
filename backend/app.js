const express = require("express");
const { PORT } = require("./utils/config");
const app = express();

app.use(express.json());
app.get("/health", (req, res) => {
  res.send("ok");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
