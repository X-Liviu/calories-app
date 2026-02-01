const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Day = require("../models/Day");
const Week = require("../models/Week");
const Meal = require("../models/Meal"); // Necesario para verificar cascada
const helper = require("./test_helper");

// Limpieza de colecciones relacionadas antes de empezar.
beforeEach(async () => {
  await Meal.deleteMany({});
  await Day.deleteMany({});
  await Week.deleteMany({});
});

describe("Controlador de Días (Days)", () => {
  let token;
  let userId;
  let weekId;

  // Setup: Obtenemos usuario del helper y creamos una semana base para estas pruebas
  beforeEach(async () => {
    // 1. El helper limpia la tabla Users, crea el usuario "testuser" y nos da su token
    const authData = await helper.getAuthToken();
    token = authData.token;
    userId = authData.userId;

    // 2. Creamos una semana asociada a ese usuario
    const week = new Week({
      number_week: 1,
      year: 2024,
      user: userId,
    });
    const savedWeek = await week.save();
    weekId = savedWeek._id;
  });

  // ======================================================
  // POST /api/weeks/:weekId (Crear Día)
  // ======================================================
  describe("POST /api/weeks/:weekId (Crear Día)", () => {
    test("crea un día válido, lo añade a la semana y devuelve la semana actualizada", async () => {
      const newDay = { name: "tuesday" }; // Probamos normalización (minúscula -> Capitalizado)

      const response = await api
        .post(`/api/weeks/${weekId}`)
        .set("Authorization", token)
        .send(newDay)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // 1. Verificamos respuesta (Semana populada)
      expect(response.body.numberWeek).toBeDefined();
      expect(response.body.days).toHaveLength(1);
      expect(response.body.days[0].name).toBe("Tuesday"); // Capitalized

      // 2. Verificamos persistencia del Día
      const daysInDb = await Day.find({ week: weekId });
      expect(daysInDb).toHaveLength(1);
      expect(daysInDb[0].name).toBe("Tuesday");

      // 3. Verificamos referencia en la Semana (Hook 'post save')
      const weekInDb = await Week.findById(weekId);
      expect(weekInDb.days).toHaveLength(1);
      expect(weekInDb.days[0].toString()).toBe(daysInDb[0]._id.toString());
    });

    test("falla con 400 si falta el nombre", async () => {
      await api
        .post(`/api/weeks/${weekId}`)
        .set("Authorization", token)
        .send({})
        .expect(400);
    });

    test("falla con 400 si intentamos duplicar un día en la misma semana (Unique Index)", async () => {
      // Crear primer día
      await api
        .post(`/api/weeks/${weekId}`)
        .set("Authorization", token)
        .send({ name: "Monday" })
        .expect(201);

      // Intentar duplicarlo
      const result = await api
        .post(`/api/weeks/${weekId}`)
        .set("Authorization", token)
        .send({ name: "Monday" })
        .expect(400);

      expect(result.body.error).toContain("already taken");
    });

    test("falla con 400 si el nombre contiene caracteres inválidos (números)", async () => {
      const invalidDay = { name: "Monday 2" }; // El regex prohíbe dígitos

      const result = await api
        .post(`/api/weeks/${weekId}`)
        .set("Authorization", token)
        .send(invalidDay)
        .expect(400);

      expect(result.body.error).toBeDefined();
    });

    test("falla con 400 si el weekId es malformado (CastError)", async () => {
      await api
        .post("/api/weeks/id-invalido-texto")
        .set("Authorization", token)
        .send({ name: "Friday" })
        .expect(400); // Middleware gestiona CastError
    });

    test("falla con 404 si la semana no existe", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await api
        .post(`/api/weeks/${fakeId}`)
        .set("Authorization", token)
        .send({ name: "Monday" })
        .expect(404);
    });

    test("falla con 404 si intentamos crear un día en la semana de OTRO usuario", async () => {
      const otherUser = new mongoose.Types.ObjectId();
      const otherUserWeek = new Week({
        number_week: 5,
        year: 2024,
        user: otherUser,
      });
      const savedOtherWeek = await otherUserWeek.save();

      await api
        .post(`/api/weeks/${savedOtherWeek._id}`)
        .set("Authorization", token)
        .send({ name: "Intruder Day" })
        .expect(404);
    });
  });

  // ======================================================
  // DELETE /api/weeks/:weekId/:dayId (Borrar Día)
  // ======================================================
  describe("DELETE /api/weeks/:weekId/:dayId", () => {
    test("elimina un día, limpia referencia en semana y borra sus comidas (Cascada)", async () => {
      // 1. Preparación: Crear Día
      const day = new Day({ name: "Friday", week: weekId, user: userId });
      const savedDay = await day.save();

      // 2. Preparación: Crear Comida dentro del Día (para probar cascada)
      const meal = new Meal({ name: "Lunch", day: savedDay._id, user: userId });
      const savedMeal = await meal.save();

      // Verificar estado inicial
      const weekBefore = await Week.findById(weekId);
      expect(weekBefore.days).toHaveLength(1);

      // 3. Acción: Borrar Día
      await api
        .delete(`/api/weeks/${weekId}/${savedDay._id}`)
        .set("Authorization", token)
        .expect(204);

      // 4. Verificaciones
      // Día borrado?
      const dayAfter = await Day.findById(savedDay._id);
      expect(dayAfter).toBeNull();

      // Referencia en Semana eliminada? (Hook pre findOneAndDelete en Day.js)
      const weekAfter = await Week.findById(weekId);
      expect(weekAfter.days).toHaveLength(0);

      // Comida borrada? (Cascada Day -> Meal)
      const mealAfter = await Meal.findById(savedMeal._id);
      expect(mealAfter).toBeNull();
    });

    test("falla con 400 si los IDs son malformados", async () => {
      await api
        .delete(`/api/weeks/${weekId}/id-dia-invalido`)
        .set("Authorization", token)
        .expect(400);
    });

    test("falla con 404 si el día no existe", async () => {
      const fakeDayId = new mongoose.Types.ObjectId();
      await api
        .delete(`/api/weeks/${weekId}/${fakeDayId}`)
        .set("Authorization", token)
        .expect(404);
    });

    test("falla con 404 si intentamos borrar un día de OTRO usuario", async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      const otherUserDay = new Day({
        name: "Forbidden Day",
        week: weekId, // Hack: lo metemos en nuestra semana para probar el filtro de usuario del día
        user: otherUserId,
      });
      const savedOtherDay = await otherUserDay.save();

      await api
        .delete(`/api/weeks/${weekId}/${savedOtherDay._id}`)
        .set("Authorization", token)
        .expect(404);
    });

    test("falla con 404 si el día existe pero pertenece a OTRA semana (Integridad URL)", async () => {
      // Crear otra semana
      const otherWeek = new Week({ number_week: 2, year: 2024, user: userId });
      const savedOtherWeek = await otherWeek.save();

      // Crear día en semana 1
      const day = new Day({ name: "Monday", week: weekId, user: userId });
      const savedDay = await day.save();

      // Intentar borrar día de semana 1 usando ID de semana 2
      await api
        .delete(`/api/weeks/${savedOtherWeek._id}/${savedDay._id}`)
        .set("Authorization", token)
        .expect(404); // El controlador busca coincidencia exacta de weekId
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
