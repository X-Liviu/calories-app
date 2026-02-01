const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

// Importamos TODOS los modelos involucrados en la jerarquía
const Week = require("../models/Week");
const Day = require("../models/Day");
const Meal = require("../models/Meal");
const MealAliment = require("../models/MealAliment");

const helper = require("./test_helper");

// Limpieza total de la jerarquía antes de cada test
beforeEach(async () => {
  await MealAliment.deleteMany({});
  await Meal.deleteMany({});
  await Day.deleteMany({});
  await Week.deleteMany({});
});

describe("GET /api/weeks", () => {
  test("falla con status 401 si no se provee token", async () => {
    await api
      .get("/api/weeks")
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("devuelve lista vacía si el usuario no tiene semanas", async () => {
    const { token } = await helper.getAuthToken();

    const response = await api
      .get("/api/weeks?year=2024")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(0);
  });

  test("devuelve las semanas correctamente formateadas", async () => {
    const { token, userId } = await helper.getAuthToken();

    const week = new Week({
      number_week: 15,
      year: 2024,
      user: userId,
    });
    await week.save();

    const response = await api
      .get("/api/weeks?year=2024")
      .set("Authorization", token)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].numberWeek).toBe(15);
    // Verificamos que no se filtre info interna
    expect(response.body[0].user).toBeUndefined();
    expect(response.body[0]._id).toBeUndefined();
  });

  test("no devuelve semanas de otros usuarios (Data Isolation)", async () => {
    // 1. Crear semana de usuario A
    const { userId: userA_Id } = await helper.getAuthToken();
    const weekA = new Week({ number_week: 1, year: 2024, user: userA_Id });
    await weekA.save();

    // 2. Crear usuario B y loguearse
    const userB = {
      name: "User B",
      username: "userB",
      email: "b@example.com",
      password: "Password123!",
    };
    await api.post("/api/users").send(userB);
    const loginRes = await api.post("/api/login").send({
      email: userB.email,
      password: userB.password,
    });
    const tokenB = `Bearer ${loginRes.body.token}`;

    // 3. Pedir semanas con usuario B
    const response = await api
      .get("/api/weeks?year=2024")
      .set("Authorization", tokenB)
      .expect(200);

    // 4. Debe estar vacío
    expect(response.body).toHaveLength(0);
  });
});

describe("POST /api/weeks", () => {
  test("crea una semana válida y devuelve 201", async () => {
    const { token } = await helper.getAuthToken();
    const newWeek = { numberWeek: 40, year: 2024 };

    await api
      .post("/api/weeks")
      .set("Authorization", token)
      .send(newWeek)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const weeksAtEnd = await helper.weeksInDb();
    expect(weeksAtEnd).toHaveLength(1);
    expect(weeksAtEnd[0].numberWeek).toBe(40);
  });

  test("falla con 400 si faltan campos requeridos", async () => {
    const { token } = await helper.getAuthToken();
    const newWeek = { year: 2024 }; // Falta numberWeek

    const response = await api
      .post("/api/weeks")
      .set("Authorization", token)
      .send(newWeek)
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  test("falla con 400 si el número de semana es inválido (>53)", async () => {
    const { token } = await helper.getAuthToken();
    const newWeek = { numberWeek: 99, year: 2024 };

    await api
      .post("/api/weeks")
      .set("Authorization", token)
      .send(newWeek)
      .expect(400);
  });

  test("falla con 400 al crear una semana duplicada (Misma semana y año)", async () => {
    const { token } = await helper.getAuthToken();
    const newWeek = { numberWeek: 1, year: 2024 };

    await api
      .post("/api/weeks")
      .set("Authorization", token)
      .send(newWeek)
      .expect(201);

    const result = await api
      .post("/api/weeks")
      .set("Authorization", token)
      .send(newWeek)
      .expect(400); // Duplicate key error

    expect(result.body.error).toContain("already taken");
  });
});

describe("DELETE /api/weeks/:id", () => {
  // --- TEST DE CASCADA PROFUNDA (NUEVO) ---
  test("Elimina la semana y TODA su jerarquía (Días -> Comidas -> Alimentos)", async () => {
    const { token, userId } = await helper.getAuthToken();

    // 1. Crear Jerarquía completa: Week -> Day -> Meal -> MealAliment

    // A. Semana
    const week = new Week({ number_week: 10, year: 2024, user: userId });
    const savedWeek = await week.save();

    // B. Día
    const day = new Day({ name: "Monday", week: savedWeek._id, user: userId });
    const savedDay = await day.save();

    // C. Comida
    const meal = new Meal({ name: "Lunch", day: savedDay._id, user: userId });
    const savedMeal = await meal.save();

    // D. Alimento en Comida (Simulado)
    const mealAliment = new MealAliment({
      name_snapshot: "Rice",
      grams: 100,
      meal: savedMeal._id,
      user: userId,
      // user_aliment: ... (opcional para este test de borrado si el modelo no lo exige estricto, o crea uno dummy)
    });
    const savedMealAliment = await mealAliment.save();

    // 2. Ejecutar borrado de la RAIZ (Semana)
    await api
      .delete(`/api/weeks/${savedWeek._id}`)
      .set("Authorization", token)
      .expect(204);

    // 3. VERIFICACIONES (Todo debe haber desaparecido)
    const weekCheck = await Week.findById(savedWeek._id);
    expect(weekCheck).toBeNull();

    const dayCheck = await Day.findById(savedDay._id);
    expect(dayCheck).toBeNull(); // El hook de Week borró el Day

    const mealCheck = await Meal.findById(savedMeal._id);
    expect(mealCheck).toBeNull(); // El hook de Day borró el Meal

    const alimentCheck = await MealAliment.findById(savedMealAliment._id);
    expect(alimentCheck).toBeNull(); // El hook de Meal borró el MealAliment
  });

  test("falla con 404 si se intenta borrar una semana de OTRO usuario", async () => {
    const { token } = await helper.getAuthToken();

    const otherUser = new mongoose.Types.ObjectId();
    const otherWeek = new Week({ number_week: 5, year: 2024, user: otherUser });
    const savedOtherWeek = await otherWeek.save();

    await api
      .delete(`/api/weeks/${savedOtherWeek._id}`)
      .set("Authorization", token)
      .expect(404);
  });

  test("falla con 400 si el ID de la semana es inválido (CastError)", async () => {
    const { token } = await helper.getAuthToken();

    await api
      .delete("/api/weeks/id-malformado-texto")
      .set("Authorization", token)
      .expect(400); // Middleware maneja CastError
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterAll(async () => {
  await mongoose.connection.close();
});
