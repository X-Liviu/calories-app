const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const rateLimit = require("express-rate-limit");
const { RateLimiterMongo } = require("rate-limiter-flexible");

const mongoose = require("mongoose");
const User = require("../models/User");

// --- RATE LIMITERS ---

// 1. IP Limiter (Memory) - Capa 1: Infraestructura
const ipLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    // En lugar de responder directamente, pasamos el error al manejador central
    const error = new Error(
      "Too many requests from this IP, please try again later",
    );
    error.name = "RateLimitError";
    next(error);
  },
});

// 2. Email Limiter (MongoDB) - Capa 2: Lógica de Negocio
// Singleton para mantener la instancia del limitador
let mongoLimiter = null;

const getMongoLimiter = () => {
  // Inicializamos solo si la conexión a Mongo está lista
  if (!mongoLimiter && mongoose.connection.readyState === 1) {
    mongoLimiter = new RateLimiterMongo({
      storeClient: mongoose.connection,
      points: 5, // 5 attempts
      duration: 60 * 60, // Per 1 hour
      blockDuration: 60 * 15, // Block for 15 minutes if consumed
      keyPrefix: "login_fail_email", // Collection name prefix in MongoDB
    });
  }
  return mongoLimiter;
};

const emailLimiter = async (req, res, next) => {
  const { email } = req.body;

  // Si no hay email, pasamos (la validación posterior de Joi se encargará)
  if (!email) return next();

  const limiter = getMongoLimiter();

  // Si la BD no está lista, fallamos en modo abierto (permitir tráfico)
  if (!limiter) {
    console.warn("RateLimiterMongo not initialized yet");
    return next();
  }

  try {
    // Consumimos 1 punto por intento
    await limiter.consume(email);
    next();
  } catch {
    const error = new Error(
      "Too many failed attempts for this email. Please try again later.",
    );
    error.name = "RateLimitError";
    next(error);
  }
};

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
    next(err);
  }
};

const ERROR_HANDLERS = {
  CastError: (res, error) => {
    return res
      .status(400)
      .json({ error: [`Malformatted ID in field: ${error.path}`] });
  },

  // Validación de negocio (ej: email duplicado detectado manualmente)
  BusinessValidationError: (res, error) => {
    // Tu código ya pasa un array de mensajes aquí
    return res.status(400).json({ error: error.messages });
  },

  ValidationError: (res, error) => {
    // Caso Joi
    if (error.isJoi) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ error: messages });
    }
    // Caso Mongoose
    if (error.errors) {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages });
    }
    // Caso Genérico
    return res.status(400).json({ error: [error.message] });
  },

  // ¡IMPORTANTE! Aquí estaba el fallo del "C" y "i". Ahora devuelve array.
  AuthenticationError: (res, error) => {
    return res.status(401).json({ error: [error.message] });
  },

  AuthorizationError: (res, error) => {
    return res.status(403).json({ error: [error.message] });
  },

  NotFoundError: (res, error) => {
    return res.status(404).json({ error: [error.message] });
  },

  RateLimitError: (res, error) => {
    return res.status(429).json({ error: [error.message] });
  },

  MongoServerError: (res, error) => {
    if (error.code === 11000) {
      const keys = Object.keys(error.keyValue);
      // Ignorar claves técnicas
      const ignoredFields = ["user", "week", "day", "meal", "_id", "__v"];
      let field = keys.find((key) => !ignoredFields.includes(key));
      if (!field) field = keys[0];

      // Mapeo de nombres bonitos
      const fieldMapping = {
        name_snapshot: "name",
        number_week: "week number",
        kcal_100g: "calories",
        username: "username",
        email: "email",
      };

      const finalFieldName = fieldMapping[field] || field;
      return res
        .status(400)
        .json({ error: [`The ${finalFieldName} is already taken`] });
    }
    return res.status(500).json({ error: ["database error"] });
  },

  JsonWebTokenError: (res) => {
    return res.status(401).json({ error: ["token invalid"] });
  },

  TokenExpiredError: (res) => {
    return res.status(401).json({ error: ["token expired"] });
  },

  defaultError: (res, error) => {
    console.error("Unknown Error:", error);
    return res.status(500).json({ error: ["Internal Server Error"] });
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
  ipLimiter,
  emailLimiter,
};
