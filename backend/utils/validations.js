const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string()
    .pattern(
      /^(?=.{2,50}$)(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
    )
    .required(),
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9._-]{3,20}$/)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().pattern(
    /^(?=.{2,50}$)(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
  ),

  username: Joi.string().pattern(/^[a-zA-Z0-9._-]{3,20}$/),

  // LOGICA DE PASSWORD:
  // newPassword es opcional. PERO si se envía (y no está vacío), debe cumplir el Regex
  newPassword: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .allow("") // Permitimos string vacío si el usuario no quiere cambiarla
    .optional(),

  // newPasswordRepeated debe ser igual a newPassword
  newPasswordRepeated: Joi.any()
    .valid(Joi.ref("newPassword"))
    .messages({ "any.only": "New passwords do not match" }),

  // currentPassword es obligatorio SOLO SI newPassword tiene contenido
  currentPassword: Joi.string().when("newPassword", {
    is: Joi.string().min(1).required(), // Si newPassword tiene al menos 1 caracter
    then: Joi.required().messages({
      "any.required": "Current password is required to set a new one",
    }),
    otherwise: Joi.optional().allow(""),
  }),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .required(),
});

const weekSchema = Joi.object({
  year: Joi.number().required(),
  numberWeek: Joi.number().min(1).max(53).required(), //TODO Aplicar weekNumber (paquete) para que no se añada una semana de un año que no exista (lo digo por la semana 53)
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
  name: Joi.string().required().max(30), // Validamos que exista y no sea enorme
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
  kcal100G: Joi.number(),
  fatG: Joi.number(),
  saturatedFatG: Joi.number(),
  carbsG: Joi.number(),
  sugarG: Joi.number(),
  fiberG: Joi.number(),
  proteinG: Joi.number(),
  saltG: Joi.number(),
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
