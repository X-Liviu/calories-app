const throwNotFound = (entity) => {
  const error = new Error(`${entity} not found`);
  error.name = "NotFoundError";
  throw error;
};

const capitalize = (str) => {
  if (!str) return "";
  str = str.trim();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

//TODO normalizar campos de mealAliment cuando se crea o se actualiza

module.exports = { throwNotFound, capitalize };
