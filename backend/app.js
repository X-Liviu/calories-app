const express = require("express");
const cors = require("cors");
const app = express();
const { dbConnection } = require("./utils/db");

const healthRouter = require("./controllers/health");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const alimentsRouter = require("./controllers/aliments");
const daysRouter = require("./controllers/days");
const weeksRouter = require("./controllers/weeks");
const middleware = require("./utils/middleware");

app.use(cors());
app.use(express.json());
dbConnection();
//No sé de momento si voy a usar luego un servidor proxy inverso, para transformar el /api/... en /...
app.use(middleware.requestLogger);
app.use("/api/health", healthRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/aliments", alimentsRouter);
app.use("/api/days", daysRouter);
app.use("/api/weeks", weeksRouter);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
