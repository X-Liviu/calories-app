const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9._-]{3,20}$/)
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
  numberWeek: Joi.number().min(1).max(52).required(),
});

const daySchema = Joi.object({
  name: Joi.string()
    .valid(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday" //eslint-disable-line
    )
    .required(),
});

const mealSchema = Joi.object({
  cheat: Joi.boolean().required(),
});

const createMealAlimentSchema = Joi.object({
  name: Joi.string().required(),
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
