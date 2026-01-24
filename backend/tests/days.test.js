const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Day = require("../models/Day");
const Week = require("../models/Week");
const helper = require("./test_helper");

// Limpieza de colecciones relacionadas antes de empezar.
// NO limpiamos Users aquí porque getAuthToken() ya se encarga de reiniciar esa colección.
beforeEach(async () => {
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

    // 2. Creamos una semana asociada a ese usuario (necesaria para meter días dentro)
    const week = new Week({
      number_week: 1,
      year: 2024,
      user: userId,
    });
    const savedWeek = await week.save();
    weekId = savedWeek._id;
  });

  describe("POST /api/weeks/:weekId (Crear Día)", () => {
    test("crea un día válido y devuelve la SEMANA actualizada", async () => {
      const newDay = { name: "tuesday" }; // Probamos normalización (minúscula -> Capitalizado)

      const response = await api
        .post(`/api/weeks/${weekId}`)
        .set("Authorization", token)
        .send(newDay)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Verificamos estructura de respuesta (Semana)
      expect(response.body.numberWeek).toBeDefined();
      expect(response.body.days).toHaveLength(1);

      // Verificamos datos del día (Capitalizado)
      const createdDay = response.body.days[0];
      expect(createdDay.name).toBe("Tuesday");

      // Verificamos persistencia en DB
      const daysInDb = await Day.find({ week: weekId });
      expect(daysInDb).toHaveLength(1);
      expect(daysInDb[0].name).toBe("Tuesday");
    });

    test("falla con 404 si la semana no existe", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await api
        .post(`/api/weeks/${fakeId}`)
        .set("Authorization", token)
        .send({ name: "Monday" })
        .expect(404);
    });

    test("falla con 400 si falta el nombre", async () => {
      await api
        .post(`/api/weeks/${weekId}`)
        .set("Authorization", token)
        .send({})
        .expect(400);
    });

    test("falla con 400 si intentamos duplicar un día en la misma semana", async () => {
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

      expect(result.body.error).toContain(
        "expected one of fields to be unique",
      );
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

    test("falla con 400 si el nombre es demasiado largo (>30 chars)", async () => {
      const longNameDay = {
        name: "Este es un nombre de día exageradamente largo para testear",
      };

      await api
        .post(`/api/weeks/${weekId}`)
        .set("Authorization", token)
        .send(longNameDay)
        .expect(400);
    });

    test("falla (idealmente 404 o 403) si intentamos crear un día en la semana de OTRO usuario", async () => {
      // 1. Simulamos una semana que pertenece a otro usuario
      const otherUser = new mongoose.Types.ObjectId();
      const otherUserWeek = new Week({
        number_week: 5,
        year: 2024,
        user: otherUser, // Dueño distinto al del token
      });
      const savedOtherWeek = await otherUserWeek.save();

      // 2. Intentamos crear un día en esa semana ajena usando NUESTRO token
      // NOTA: Si tu controlador no valida la propiedad de la semana, este test fallará (dará 201).
      // Si eso pasa, es un agujero de seguridad que debemos arreglar en el controlador.
      await api
        .post(`/api/weeks/${savedOtherWeek._id}`)
        .set("Authorization", token)
        .send({ name: "Intruder Day" })
        .expect(404); // Esperamos que no la encuentre o no la deje usar
    });
  });

  describe("DELETE /api/weeks/:weekId/:dayId", () => {
    test("elimina un día y actualiza la referencia en la semana", async () => {
      // 1. Preparación: Insertar un día directamente en BD vinculado a la semana
      const day = new Day({
        name: "Friday",
        week: weekId,
        user: userId,
      });
      const savedDay = await day.save();

      // Verificar estado inicial
      const weekBefore = await Week.findById(weekId);
      expect(weekBefore.days).toHaveLength(1);

      // 2. Acción: Borrar vía API
      await api
        .delete(`/api/weeks/${weekId}/${savedDay._id}`)
        .set("Authorization", token)
        .expect(204);

      // 3. Verificaciones
      const dayAfter = await Day.findById(savedDay._id);
      expect(dayAfter).toBeNull();

      const weekAfter = await Week.findById(weekId);
      expect(weekAfter.days).toHaveLength(0);
    });

    test("falla con 404 si el día no existe", async () => {
      const fakeDayId = new mongoose.Types.ObjectId();
      await api
        .delete(`/api/weeks/${weekId}/${fakeDayId}`)
        .set("Authorization", token)
        .expect(404);
    });

    test("falla con 404 si intentamos borrar un día de OTRO usuario", async () => {
      // 1. Creamos un día manualmente que pertenece a "otro" usuario ficticio
      const otherUserId = new mongoose.Types.ObjectId();
      const otherUserDay = new Day({
        name: "Forbidden Day",
        week: weekId, // Misma semana (para aislar la prueba al user del día)
        user: otherUserId,
      });
      const savedOtherDay = await otherUserDay.save();

      // 2. Intentamos borrarlo con NUESTRO token
      await api
        .delete(`/api/weeks/${weekId}/${savedOtherDay._id}`)
        .set("Authorization", token)
        .expect(404); // Debería decir "Day not found" porque el filtro user: req.userId no coincidirá
    });

    test("falla con 404 si la semana en la URL no existe (aunque el día sí exista)", async () => {
      // 1. Crear día válido
      const day = new Day({ name: "Monday", week: weekId, user: userId });
      const savedDay = await day.save();

      const fakeWeekId = new mongoose.Types.ObjectId();

      // 2. Intentar borrar con weekId incorrecto
      await api
        .delete(`/api/weeks/${fakeWeekId}/${savedDay._id}`)
        .set("Authorization", token)
        .expect(404);
    });

    test("falla con 404 si el día existe pero pertenece a OTRA semana", async () => {
      // 1. Crear otra semana
      const otherWeek = new Week({ number_week: 2, year: 2024, user: userId });
      const savedOtherWeek = await otherWeek.save();

      // 2. Crear día en la semana 1
      const day = new Day({ name: "Monday", week: weekId, user: userId });
      const savedDay = await day.save();

      // 3. Intentar borrar el día de la semana 1, pero diciendo que es de la semana 2 en la URL
      await api
        .delete(`/api/weeks/${savedOtherWeek._id}/${savedDay._id}`)
        .set("Authorization", token)
        .expect(404); // El controlador busca { week: weekId, _id: dayId }, así que no debería encontrarlo
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
