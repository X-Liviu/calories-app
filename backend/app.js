const express = require("express");
const cors = require("cors");
const app = express();
const { dbConnection } = require("./utils/db");

const healthRouter = require("./controllers/health");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const weeksRouter = require("./controllers/weeks");
const userAlimentsRouter = require("./controllers/userAliments");

const {
  requestLogger,
  tokenExtractor,
  errorHandler,
  unknownEndpoint,
} = require("./utils/middleware");

app.use(cors());
app.use(express.json());
dbConnection();
//No sé de momento si voy a usar luego un servidor proxy inverso, para transformar el /api/... en /...
app.use(requestLogger);
app.use("/api/health", healthRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/weeks", tokenExtractor, weeksRouter);
app.use("/api/my-aliments", tokenExtractor, userAlimentsRouter);
app.use(errorHandler);
app.use(unknownEndpoint);

module.exports = app;
