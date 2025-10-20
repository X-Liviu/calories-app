export const validateSignUpForm = ({
  name,
  username,
  email,
  password,
  passwordRepeated,
}) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (!validateName(name)) {
    errors.name =
      "Name can only contain letters and single spaces, hyphens, apostrophes, or commas, without leading or trailing spaces";
  }

  if (!username.trim()) {
    errors.username = "Username is required";
  } else if (!validateUsername(username)) {
    errors.username =
      "Username can only contain letters, numbers, dots, or underscores (3-20 chars)";
  }

  if (!validateEmail(email)) errors.email = "E-Mail not valid";

  const passwordRules = [
    {
      key: "length",
      label: "At least 8 characters",
      test: (pw) => pw.length >= 8,
    },
    {
      key: "uppercase",
      label: "At least 1 uppercase letter",
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      key: "lowercase",
      label: "At least 1 lowercase letter",
      test: (pw) => /[a-z]/.test(pw),
    },
    { key: "number", label: "At least 1 number", test: (pw) => /\d/.test(pw) },
    {
      key: "symbol",
      label: "At least 1 symbol",
      test: (pw) => /[\W_]/.test(pw),
    },
  ];

  const evaluatedRules = passwordRules.map((rule) => ({
    label: rule.label,
    valid: rule.test(password),
  }));

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  if (password !== passwordRepeated)
    errors.passwordRepeated = "Passwords do not match";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    passwordRules: evaluatedRules,
  };
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!validateEmail(email)) errors.email = "E-Mail not valid";

  if (!password || password.length < 8)
    errors.password = "Password must be at least 8 characters";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateNumberWeek = (n) => {
  const num = Number(n);
  return num >= 1 && num <= 52 && !isNaN(num);
};

export const validateOnlyLetters = (text) => {
  const evaluate = text || "";
  const regex = /^[A-Za-z]+$/;
  return regex.test(evaluate);
};

export const validateOnlyNumbers = (grams) => {
  return grams.trim() !== "" && !isNaN(Number(grams));
};

export const validateNoEmpty = (text) => {
  const regex = /^[^\s]+( [^\s]+)*$/;
  return regex.test(text);
};

export const validateCustomAliment = ({
  nameAliment,
  gramsAliment,
  totalKcalAliment,
}) => {
  if (!nameAliment || nameAliment.trim().length === 0 || /\s/.test(nameAliment))
    return false;

  if (!gramsAliment || isNaN(gramsAliment) || Number(gramsAliment) <= 0)
    return false;

  if (
    !totalKcalAliment ||
    isNaN(totalKcalAliment) ||
    Number(totalKcalAliment) <= 0
  )
    return false;

  return true;
};

export const validateName = (name) => {
  const evaluate = name || "";
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ ,'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
  return nameRegex.test(evaluate);
};

const validateUsername = (username) => {
  const evaluate = username || "";
  const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
  return usernameRegex.test(evaluate);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/\d/.test(password)) return "Password must contain at least one number";
  if (!/[\W_]/.test(password))
    return "Password must contain at least one symbol";
  return null;
};
