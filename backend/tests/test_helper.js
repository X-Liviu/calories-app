const Week = require("../models/Week");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET } = require("../utils/config");

const initialWeeks = [
  {
    numberWeek: 1,
    year: 2024,
  },
  {
    numberWeek: 2,
    year: 2024,
  },
];

// Devuelve todas las semanas de la BD formateadas
const weeksInDb = async () => {
  const weeks = await Week.find({});
  return weeks.map((week) => week.toJSON());
};

// --- NUEVO: Devuelve todos los usuarios de la BD formateados ---
const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

// Crea un usuario de prueba ESTÁNDAR y devuelve su Token y su ID
// Nota: La contraseña de este usuario siempre es 'secret123'
const getAuthToken = async () => {
  await User.deleteMany({}); // Aseguramos limpieza antes de crear el usuario base

  const passwordHash = await bcrypt.hash("Secret123!", 10);
  const user = new User({
    username: "testuser",
    name: "Test User",
    email: "test@example.com",
    password_hash: passwordHash,
    registrationDate: new Date(),
    loginAttempts: 0,
  });

  const savedUser = await user.save();

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  const token = jwt.sign(userForToken, SECRET);

  return {
    token: `Bearer ${token}`,
    userId: savedUser._id,
    // Devolvemos también el usuario crudo por si hace falta verificar datos
    username: savedUser.username,
    email: savedUser.email,
  };
};

module.exports = {
  initialWeeks,
  weeksInDb,
  usersInDb, // Exportamos la nueva función
  getAuthToken,
};
