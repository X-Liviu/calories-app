const Joi = require("joi");

// --- CONSTANTS & REGEX ---
const LIMITS = {
  MAX_NUTRITION: 9999.99,
};

const PATTERNS = {
  NAME: /^(?=.{2,50}$)(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
  USERNAME: /^[a-zA-Z0-9._-]{3,20}$/,
  PASSWORD_COMPLEXITY:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  CATALOG_NAME: /^[a-zA-Z0-9\s\-\.\,\(\)\%]+$/, //eslint-disable-line
  SIMPLE_TEXT: /^[^\s\d]+( [^\s\d]+)*$/,
  MEAL_ALIMENT: /^[^\s]+( [^\s]+)*$/,
};

// --- REUSABLE MESSAGES ---
const MESSAGES = {
  general: {
    maxNutrition: `Value cannot exceed ${LIMITS.MAX_NUTRITION}`,
  },
  name: {
    "string.pattern.base":
      "Name must be 2-50 characters long and contain only letters.",
    "string.empty": "Name is required.",
    "string.base": "Name must be a text string.",
    "string.max": "Name cannot exceed 30 characters.",
  },
  username: {
    "string.pattern.base":
      "Username must be 3-20 characters long (letters, numbers, . _ -).",
    "string.empty": "Username is required.",
  },
  email: {
    "string.email": "Invalid email format.",
    "string.empty": "Email is required.",
  },
  passwordStrong: {
    "string.pattern.base":
      "Password must be at least 8 characters, with uppercase, lowercase, number, and symbol.",
    "string.empty": "Password is required.",
  },
  passwordSimple: {
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  },
};

// --- COMMON RULES ---
const limitedNumberRule = Joi.number()
  .min(0)
  .max(LIMITS.MAX_NUTRITION)
  .messages({
    "number.max": MESSAGES.general.maxNutrition,
  });

// --- SCHEMAS ---

const createUserSchema = Joi.object({
  name: Joi.string().pattern(PATTERNS.NAME).required().messages(MESSAGES.name),
  username: Joi.string()
    .pattern(PATTERNS.USERNAME)
    .required()
    .messages(MESSAGES.username),
  email: Joi.string().email().required().messages(MESSAGES.email),
  password: Joi.string()
    .pattern(PATTERNS.PASSWORD_COMPLEXITY)
    .required()
    .messages(MESSAGES.passwordStrong),
});

const updateUserSchema = Joi.object({
  name: Joi.string().pattern(PATTERNS.NAME).messages(MESSAGES.name),
  username: Joi.string().pattern(PATTERNS.USERNAME).messages(MESSAGES.username),
  newPassword: Joi.string()
    .pattern(PATTERNS.PASSWORD_COMPLEXITY)
    .allow("")
    .optional()
    .messages(MESSAGES.passwordStrong),
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
  email: Joi.string().email().required().messages(MESSAGES.email),
  password: Joi.string().required().messages(MESSAGES.passwordSimple),
});

const weekSchema = Joi.object({
  year: Joi.number().required(),
  numberWeek: Joi.number().min(1).max(53).required(),
});

const daySchema = Joi.object({
  name: Joi.string().pattern(PATTERNS.SIMPLE_TEXT).max(30).required(),
});

const mealSchema = Joi.object({
  cheat: Joi.boolean().required(),
});

const createMealSchema = Joi.object({
  name: Joi.string().required().max(30),
});

const createMealAlimentSchema = Joi.object({
  name: Joi.string().pattern(PATTERNS.MEAL_ALIMENT).max(30).required(),

  grams: limitedNumberRule.required(),
  userAliment: Joi.string().max(30),
  customKcal: limitedNumberRule,
});

const changeMealAlimentSchema = Joi.object({
  grams: limitedNumberRule.required(),
});

const catalogNameSchema = Joi.string()
  .trim()
  .min(2)
  .max(30)
  .pattern(PATTERNS.CATALOG_NAME)
  .required()
  .messages(MESSAGES.name);

const nutritionRules = {
  kcal100G: limitedNumberRule,
  fatG: limitedNumberRule,
  saturatedFatG: limitedNumberRule,
  carbsG: limitedNumberRule,
  sugarG: limitedNumberRule,
  fiberG: limitedNumberRule,
  proteinG: limitedNumberRule,
  saltG: limitedNumberRule,
};

const userAlimentSchema = Joi.object({
  ...nutritionRules,
}).options({ presence: "required" });

const updateUserAlimentSchema = Joi.object({
  ...nutritionRules,
}).options({ presence: "optional" });

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
  updateUserAlimentSchema,
  catalogNameSchema,
};
