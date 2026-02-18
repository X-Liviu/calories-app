import { weeksPerYear } from "weeknumber";

export const evaluatePasswordRules = (password) => {
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

  return passwordRules.map((rule) => ({
    label: rule.label,
    valid: rule.test(password || ""),
  }));
};

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
    errors.name = "2-50 chars, letters, numbers, . _ - ,";
  }

  if (!username.trim()) {
    errors.username = "Username is required";
  } else if (!validateUsername(username)) {
    errors.username = "3‑20 chars, letters/numbers/._-";
  }

  if (!validateEmail(email)) errors.email = "E-Mail not valid";

  const evaluatedRules = evaluatePasswordRules(password);

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

export const validateUpdateUserForm = ({
  name,
  username,
  currentPassword,
  newPassword,
  newPasswordRepeated,
}) => {
  const errors = {};

  if (!name.trim()) errors.name = "Name is required";
  else if (!validateName(name))
    errors.name = "2-50 chars, letters, numbers, . _ - ,";

  if (!username.trim()) errors.username = "Username is required";
  else if (!validateUsername(username))
    errors.username = "3‑20 chars, letters/numbers/._-";

  if (currentPassword || newPassword || newPasswordRepeated) {
    if (!currentPassword) {
      errors.currentPassword = "Current password is required to set a new one";
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) errors.newPassword = passwordError;

    if (newPassword !== newPasswordRepeated) {
      errors.newPasswordRepeated = "New passwords do not match";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!validateEmail(email)) errors.email = "E-Mail not valid";

  if (!password) errors.password = "Password is required"; //El error ahora no se usa

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateNumberWeek = ({ numberWeek, year }) => {
  const maxWeeks = weeksPerYear(year);
  numberWeek = Number(numberWeek);
  if (isNaN(numberWeek) || numberWeek < 1 || numberWeek > maxWeeks)
    return false;

  return true;
};

export const validateOnlyLetters = (text) => {
  const evaluate = text || "";
  const regex = /^[^\s\d]+( [^\s\d]+)*$/;
  return regex.test(evaluate) && text.length <= 30;
};

export const validateOnlyNumbers = (n) => {
  const regex = /^\d{1,5}$/;
  return regex.test(n.toString());
};

export const validateNumberInput = (value) => {
  if (value === "") return value;

  if (Number(value) >= 10000) {
    return null;
  }
  return value;
};

export const validateNoEmpty = (text) => {
  const evaluate = text || "";
  const regex = /^[^\s]+( [^\s]+)*$/;
  return regex.test(evaluate) && text.length <= 30;
};

export const validateCustomAliment = ({
  nameAliment,
  gramsAliment,
  totalKcalAliment,
}) => {
  if (
    !nameAliment ||
    nameAliment.trim().length === 0 ||
    !validateNoEmpty(nameAliment)
  )
    return false;

  if (
    gramsAliment <= 10000 &&
    (isNaN(gramsAliment) || Number(gramsAliment) <= 0)
  )
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
  const nameRegex =
    /^(?=.{2,50}$)(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
  return nameRegex.test(evaluate);
};

const validateUsername = (username) => {
  const evaluate = username || "";
  const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
  return usernameRegex.test(evaluate);
};

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

export const validateDecimalInput = (value) => {
  if (value === "") return value;
  const normalizedValue = value.replace(",", ".");

  if (/^\d*\.?\d*$/.test(normalizedValue)) {
    if (Number(normalizedValue) > 9999.99) {
      return null;
    }
    return normalizedValue;
  }

  return null;
};
