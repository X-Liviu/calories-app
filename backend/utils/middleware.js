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
    const error = new Error("token missing");
    error.name = "AuthenticationError";
    throw error;
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      const error = new Error("token invalid: missing user id");
      error.name = "AuthenticationError";
      throw error;
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      const error = new Error("token invalid: user not found");
      error.name = "AuthenticationError";
      throw error;
    }

    //req.decodedToken = decodedToken; //No sé si me va a hacer falta.
    req.userId = decodedToken.id;

    next();
  } catch (err) {
    next(err); //o return next(err) ¿?¿?
  }
};

const ERROR_HANDLERS = {
  CastError: (res, error) => {
    // Mongoose nos dice qué campo falló en error.path
    return res
      .status(400)
      .json({ error: `Malformatted ID in field: ${error.path}` });
  },

  ValidationError: (res, error) => {
    // 1. Errores de Joi (Tu validación de entrada)
    if (error.isJoi) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // 2. Errores de Mongoose (Validación del Schema)
    // Mongoose agrupa los errores en un objeto 'errors'
    if (error.errors) {
      // Extraemos todos los mensajes de error de los sub-campos
      const messages = Object.values(error.errors).map((e) => e.message);
      // Los unimos en un solo string o devolvemos el array
      return res.status(400).json({ error: messages.join(", ") });
    }

    // 3. Errores manuales lanzados con name: "ValidationError"
    return res.status(400).json({ error: error.message });
  },

  AuthenticationError: (res, error) => {
    return res.status(401).json({ error: error.message });
  },

  AuthorizationError: (res, error) => {
    return res.status(403).json({ error: error.message });
  },

  NotFoundError: (res, error) => {
    return res.status(404).json({ error: error.message });
  },

  MongoServerError: (res, error) => {
    // Código 11000 es Duplicate Key
    if (error.code === 11000) {
      // error.keyValue nos dice qué campo y valor duplicaron { username: "test" }
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `The ${field} is already taken` });
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

  defaultError: (res, error) => {
    // Es útil devolver el mensaje en desarrollo, pero genérico en producción
    console.error("Unknown Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  },
};

const errorHandler = (
  error,
  request,
  response,
  /*eslint-disable-line */ next,
) => {
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
