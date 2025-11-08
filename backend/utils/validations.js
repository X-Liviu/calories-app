const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string()
    .pattern(
      /^(?=.{2,50}$)(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/ //eslint-disable-line
    )
    .required(),
  username: Joi.string()
    .pattern(
      /^[a-zA-Z0-9._-]{3,20}$/ //eslint-disable-line
    )
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ /*eslint-disable-line */
    )
    .required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ /*eslint-disable-line */
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
  grams: Joi.number().required(),
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
  createMealAlimentSchema,
  changeMealAlimentSchema,
  userAlimentSchema,
};
