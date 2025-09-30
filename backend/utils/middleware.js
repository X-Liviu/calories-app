const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const User = require("../models/User");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body ? request.body : "--");
  console.log("---");
  next();
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid: missing user id" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: "token invalid: user not found" });
    }

    //req.decodedToken = decodedToken; //No sé si me va a hacer falta.
    req.userId = decodedToken.id;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "token invalid", message: err.message });
  }
};

const ERROR_HANDLERS = {
  CastError: (res) => res.status(400).send({ error: "id used is malformed" }),
  ValidationError: (res, error) => {
    return res.status(409).json({ error: error.message });
  },
  MongoServerError: (res, error) => {
    if (error.message.includes("E11000 duplicate key error")) {
      return res
        .status(400)
        .json({ error: "expected one of fields to be unique" });
    }
    return res.status(500).json({ error: "database error" });
  },
  JsonWebTokenError: (res) => {
    return res.status(401).json({ error: "token invalid" });
  },
  TokenExpiredError: (res) => {
    return res.status(401).json({
      error: "token expired",
    });
  },
  defaultError: (res) => res.status(500).end(),
};

const errorHandler = (
  error,
  request,
  response,
  /*eslint-disable-line */ next
) => {
  //Falla todo si no pones el next, un poco raro y que no entiendo bien el fallo. Tampoco puedo usar eslint-disable-line porque el formatter me lo mueve en la siguiente línea
  console.error(error.message);

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;
  return handler(response, error);
};

const unknownEndpoint = (req, res) => {
  return res.status(404).json({ error: "unknown endpoint" });
};

module.exports = {
  requestLogger,
  tokenExtractor,
  errorHandler,
  unknownEndpoint,
};
