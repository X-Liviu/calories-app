const Joi = require("joi");

const nameMessages = {
  "string.pattern.base":
    "Name must be 2-50 characters long and contain only letters.",
  "string.empty": "Name is required.",
  "string.base": "Name must be a text string.",
};

const usernameMessages = {
  "string.pattern.base":
    "Username must be 3-20 characters long (letters, numbers, . _ -).",
  "string.empty": "Username is required.",
};

const passwordMessages = {
  "string.pattern.base":
    "Password must be at least 8 characters, with uppercase, lowercase, number, and symbol.",
  "string.empty": "Password is required.",
};

const emailMessages = {
  "string.email": "Invalid email format.",
  "string.empty": "Email is required.",
};

const createUserSchema = Joi.object({
  name: Joi.string()
    .pattern(
      /^(?=.{2,50}$)(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
    )
    .required()
    .messages(nameMessages),

  username: Joi.string()
    .pattern(/^[a-zA-Z0-9._-]{3,20}$/)
    .required()
    .messages(usernameMessages),

  email: Joi.string().email().required().messages(emailMessages),

  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .required()
    .messages(passwordMessages),
});

const updateUserSchema = Joi.object({
  name: Joi.string()
    .pattern(
      /^(?=.{2,50}$)(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
    )
    .messages(nameMessages),

  username: Joi.string()
    .pattern(/^[a-zA-Z0-9._-]{3,20}$/)
    .messages(usernameMessages),

  newPassword: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .allow("")
    .optional()
    .messages(passwordMessages),

  newPasswordRepeated: Joi.any()
    .valid(Joi.ref("newPassword"))
    .messages({ "any.only": "New passwords do not match" }),

  currentPassword: Joi.string().when("newPassword", {
    is: Joi.string().min(1).required(),
    then: Joi.required().messages({
      "any.required": "Current password is required to set a new one",
    }),
    otherwise: Joi.optional().allow(""),
  }),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages(emailMessages),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .required()
    .messages(passwordMessages),
});

const weekSchema = Joi.object({
  year: Joi.number().required(),
  numberWeek: Joi.number().min(1).max(53).required(),
});

const daySchema = Joi.object({
  name: Joi.string()
    .pattern(/^[^\s\d]+( [^\s\d]+)*$/)
    .max(30)
    .required(),
});

const mealSchema = Joi.object({
  cheat: Joi.boolean().required(),
});

const createMealSchema = Joi.object({
  name: Joi.string().required().max(30),
});

const createMealAlimentSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[^\s]+( [^\s]+)*$/)
    .max(30)
    .required(),
  grams: Joi.number().required(),
  userAliment: Joi.string(),
  customKcal: Joi.number(),
});

const changeMealAlimentSchema = Joi.object({
  grams: Joi.number().required().min(0),
});

const userAlimentSchema = Joi.object({
  kcal100G: Joi.number().min(0).required(),
  fatG: Joi.number().min(0),
  saturatedFatG: Joi.number().min(0),
  carbsG: Joi.number().min(0),
  sugarG: Joi.number().min(0),
  fiberG: Joi.number().min(0),
  proteinG: Joi.number().min(0),
  saltG: Joi.number().min(0),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  weekSchema,
  daySchema,
  mealSchema,
  createMealSchema,
  createMealAlimentSchema,
  changeMealAlimentSchema,
  userAlimentSchema,
  updateUserSchema,
};
