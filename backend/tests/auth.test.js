const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Importamos la app configurada (sin escuchar puerto)
const api = supertest(app); // Envolvemos la app con supertest para simular peticiones
const User = require("../models/User");
const helper = require("./test_helper"); // Importamos nuestro helper de utilidades

// --- DATOS DE PRUEBA ---
// Definimos un usuario "nuevo" que NO existe en la BD inicialmente.
// (El helper crea otro usuario distinto llamado "testuser")
const newUser = {
  name: "New User",
  username: "newuser",
  email: "new@example.com",
  password: "Password123!", // Cumple con tu Regex de seguridad
};

// --- CONFIGURACIÓN PREVIA ---
// Antes de cada test, limpiamos la colección de usuarios para empezar desde cero.
beforeEach(async () => {
  await User.deleteMany({});
});

// ==========================================
// 1. BLOQUE DE TESTS: REGISTRO DE USUARIOS
// ==========================================
describe("Register /api/users", () => {
  test("creation succeeds with fresh username and valid data", async () => {
    // Intentamos registrar al usuario "newUser"
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201) // Esperamos código 201 Created
      .expect("Content-Type", /application\/json/);

    // VERIFICACIÓN EN BASE DE DATOS:
    // Usamos el helper para contar cuántos usuarios hay realmente
    const usersAtEnd = await helper.usersInDb();

    // Debería haber exactamente 1 usuario
    expect(usersAtEnd).toHaveLength(1);
    // El nombre de usuario guardado debe coincidir con el enviado
    expect(usersAtEnd[0].username).toBe(newUser.username);
  });

  test("creation fails with status 400 if username already taken", async () => {
    // 1. PREPARACIÓN: Usamos el helper para crear un usuario por defecto ("testuser") en la BD
    await helper.getAuthToken();

    // 2. EJECUCIÓN: Intentamos crear OTRO usuario con el MISMO username ("testuser")
    const duplicateUser = {
      ...newUser,
      username: "testuser", // Este username ya existe gracias al helper
    };

    const result = await api
      .post("/api/users")
      .send(duplicateUser)
      .expect(400) // Esperamos 400 Bad Request
      .expect("Content-Type", /application\/json/);

    // 3. VERIFICACIÓN: El mensaje de error debe indicar el fallo de índice único
    expect(result.body.error).toContain("expected one of fields to be unique");
  });

  test("creation fails with status 400 if password is weak (Joi Validation)", async () => {
    // Definimos un usuario con contraseña débil
    const weakUser = {
      ...newUser,
      password: "123", // No cumple tu regex (min 8 chars, mayúsculas, etc.)
    };

    const result = await api.post("/api/users").send(weakUser).expect(400); // Joi debería rechazarlo automáticamente

    // Verificamos que Joi haya devuelto un mensaje de error
    expect(result.body.error).toBeDefined();
  });

  test("creation fails with status 400 if email is already taken", async () => {
    // 1. PREPARACIÓN: Creamos el usuario por defecto (email: test@example.com)
    await helper.getAuthToken();

    // 2. EJECUCIÓN: Intentamos crear un usuario nuevo con Username distinto pero MISMO Email
    const duplicateEmailUser = {
      ...newUser,
      email: "test@example.com", // El email que usa el helper internamente
    };

    const result = await api
      .post("/api/users")
      .send(duplicateEmailUser)
      .expect(400); // Tu middleware captura el error E11000 de Mongo

    expect(result.body.error).toContain("expected one of fields to be unique");
  });
});

// ==========================================
// 2. BLOQUE DE TESTS: LOGIN
// ==========================================
describe("Login /api/login", () => {
  // Configuración rápida: antes de probar login, NECESITAMOS que el usuario exista
  beforeEach(async () => {
    await helper.getAuthToken(); // Crea el usuario "testuser" con pass "Secret123!"
  });

  test("login succeeds with correct credentials", async () => {
    // Intentamos loguearnos con las credenciales que sabemos que crea el helper
    const result = await api
      .post("/api/login")
      .send({
        email: "test@example.com",
        password: "Secret123!",
      })
      .expect(200) // Éxito
      .expect("Content-Type", /application\/json/);

    // Verificamos que la respuesta incluya el token y el username correcto
    expect(result.body.token).toBeDefined();
    expect(result.body.username).toBe("testuser");
  });

  test("login fails with status 401 if user does not exist", async () => {
    // Probamos con un email que no está en la BD
    const result = await api
      .post("/api/login")
      .send({
        email: "nonexistent@example.com",
        password: "Secret123!",
      })
      .expect(401); // Unauthorized

    expect(result.body.error).toBe("invalid username or password");
  });

  test("login fails with status 401 if password is wrong", async () => {
    // Probamos con el email correcto pero contraseña incorrecta
    const result = await api
      .post("/api/login")
      .send({
        email: "test@example.com",
        password: "WrongPassword123!",
      })
      .expect(401); // Unauthorized

    expect(result.body.error).toBe("invalid username or password");
  });
});

// ==========================================
// 3. BLOQUE DE TESTS: GESTIÓN DE CUENTA (PUT/DELETE)
// ==========================================
describe("User Management (PUT/DELETE)", () => {
  let token;
  let userId;

  // ANTES DE CADA TEST de este bloque:
  // 1. Creamos el usuario en la BD.
  // 2. Obtenemos su token válido para poder hacer las peticiones protegidas.
  beforeEach(async () => {
    const authData = await helper.getAuthToken();
    token = authData.token; // Formato: "Bearer eyJhbGci..."
    userId = authData.userId; // ID de mongo
  });

  test("update succeeds when changing name and username", async () => {
    const updates = {
      name: "Updated Name",
      username: "updated_user",
    };

    const response = await api
      .put("/api/users")
      .set("Authorization", token) // ¡IMPORTANTE! Enviamos el token en la cabecera
      .send(updates)
      .expect(200);

    // Verificamos que la respuesta del servidor refleje los cambios
    expect(response.body.name).toBe(updates.name);
    expect(response.body.username).toBe(updates.username);
  });

  test("password update fails if current password is missing", async () => {
    // Intentamos cambiar la contraseña sin enviar la 'currentPassword'
    // Esto debería fallar según tu esquema de Joi (updateUserSchema)
    const updates = {
      newPassword: "NewPassword123!",
      newPasswordRepeated: "NewPassword123!",
    };

    const result = await api
      .put("/api/users")
      .set("Authorization", token)
      .send(updates)
      .expect(400); // Fallo de validación

    // Verificamos el mensaje de error personalizado de Joi
    expect(result.body.error).toContain("Current password is required");
  });

  test("delete user succeeds with valid token", async () => {
    // Solicitamos borrar la cuenta propia
    await api.delete("/api/users").set("Authorization", token).expect(204); // 204 No Content (éxito sin cuerpo de respuesta)

    // VERIFICACIÓN FINAL:
    // Buscamos el usuario por ID en la base de datos para asegurar que ya no existe
    const userInDb = await User.findById(userId);
    expect(userInDb).toBeNull();
  });

  test("delete user fails with 401 if token is missing", async () => {
    // Intentamos borrar sin enviar cabecera Authorization
    await api.delete("/api/users").expect(401); // Error lanzado por tokenExtractor
  });

  test("update fails with 400 if trying to use an existing username/email", async () => {
    // 1. Creamos un segundo usuario para generar conflicto
    const otherUser = {
      name: "Other User",
      username: "otheruser",
      email: "other@example.com",
      password: "Password123!",
    };
    await api.post("/api/users").send(otherUser);

    // 2. Intentamos actualizar NUESTRO usuario para tener el username del OTRO
    const updates = {
      username: "otheruser", // Conflicto
    };

    const result = await api
      .put("/api/users")
      .set("Authorization", token)
      .send(updates)
      .expect(400);

    expect(result.body.error).toContain("expected one of fields to be unique");
  });

  test("delete user removes related data (Cascade: Weeks/Days)", async () => {
    // 1. Crear una Semana y un Día asociados a este usuario
    const Week = require("../models/Week");
    const Day = require("../models/Day");

    const week = new Week({ number_week: 1, year: 2024, user: userId });
    const savedWeek = await week.save();

    const day = new Day({
      name: "Cascading Day",
      week: savedWeek._id,
      user: userId,
    });
    await day.save();

    // 2. Borrar el usuario
    await api.delete("/api/users").set("Authorization", token).expect(204);

    // 3. Verificaciones: El usuario no existe
    const userInDb = await User.findById(userId);
    expect(userInDb).toBeNull();

    // 4. Verificaciones: La semana NO debe existir
    const weekInDb = await Week.findOne({ user: userId });
    expect(weekInDb).toBeNull();

    // 5. Verificaciones: El día NO debe existir
    // (El hook de User borra Week, y el hook de Week borra Day)
    const dayInDb = await Day.findById(day._id);
    expect(dayInDb).toBeNull();
  });
});

// --- LIMPIEZA FINAL ---
// Cerramos la conexión a Mongoose para evitar que Jest se quede colgado
afterAll(async () => {
  await mongoose.connection.close();
});
