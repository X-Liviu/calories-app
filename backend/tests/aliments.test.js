const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const MealAliment = require("../models/MealAliment");
const Meal = require("../models/Meal");
const Day = require("../models/Day");
const Week = require("../models/Week");
const helper = require("./test_helper");

// Limpieza total antes de cada ejecución
beforeEach(async () => {
  await MealAliment.deleteMany({});
  await Meal.deleteMany({});
  await Day.deleteMany({});
  await Week.deleteMany({});
});

describe("Controlador de Alimentos en Comidas (MealAliments)", () => {
  let token;
  let userId;
  let weekId;
  let dayId;
  let mealId;

  // --- SETUP: Usuario -> Semana -> Día -> Comida ---
  beforeEach(async () => {
    // 1. Usuario
    const authData = await helper.getAuthToken();
    token = authData.token;
    userId = authData.userId;

    // 2. Semana
    const week = new Week({ number_week: 1, year: 2024, user: userId });
    const savedWeek = await week.save();
    weekId = savedWeek._id;

    // 3. Día
    const day = new Day({ name: "Monday", week: weekId, user: userId });
    const savedDay = await day.save();
    dayId = savedDay._id;

    // 4. Comida
    const meal = new Meal({ name: "Lunch", day: dayId, user: userId });
    const savedMeal = await meal.save();
    mealId = savedMeal._id;
  });

  // ======================================================
  // POST /:weekId/:dayId/:mealId (Añadir Alimento)
  // ======================================================
  describe("POST /api/weeks/:weekId/:dayId/:mealId", () => {
    test("añade un alimento válido, actualiza la Comida y devuelve la semana", async () => {
      const newAliment = {
        name: "Apple",
        grams: 150,
        customKcal: 52,
      };

      const response = await api
        .post(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send(newAliment)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // 1. Verificamos respuesta profunda
      const day = response.body.days.find((d) => d.id === dayId.toString());
      const meal = day.meals.find((m) => m.id === mealId.toString());
      expect(meal.aliments).toHaveLength(1);
      expect(meal.aliments[0].nameSnapshot).toBe("Apple");
      expect(meal.aliments[0].grams).toBe(150);

      // 2. Verificamos persistencia
      const alimentInDb = await MealAliment.findOne({ meal: mealId });
      expect(alimentInDb).toBeDefined();
      expect(alimentInDb.name_snapshot).toBe("Apple");

      // 3. Verificamos referencia en la Comida (Hook 'post save')
      const mealInDb = await Meal.findById(mealId);
      expect(mealInDb.aliments).toHaveLength(1);
      expect(mealInDb.aliments[0].toString()).toBe(alimentInDb._id.toString());
    });

    test("falla con 400 si faltan gramos (Joi validation)", async () => {
      const invalidAliment = { name: "Apple" }; // Faltan grams

      await api
        .post(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send(invalidAliment)
        .expect(400);
    });

    test("falla con 400 si se duplica el nombre del alimento en la misma comida", async () => {
      const aliment = { name: "Rice", grams: 100 };

      // 1. Insertar primero
      await api
        .post(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send(aliment)
        .expect(201);

      // 2. Intentar duplicar
      const result = await api
        .post(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send(aliment)
        .expect(400);

      expect(result.body.error).toContain("already taken");
    });

    // Caso A: ID de Semana malformado -> 400 (Mongoose CastError en Week.findOne)
    test("falla con 400 si el weekId es malformado", async () => {
      await api
        .post(`/api/weeks/id-week-invalido/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send({ name: "Apple", grams: 100 })
        .expect(400);
    });

    // Caso B: ID de Día/Comida malformado -> 404 (Tu lógica array.find devuelve undefined)
    test("falla con 404 si el dayId o mealId es malformado (Lógica array)", async () => {
      await api
        .post(`/api/weeks/${weekId}/id-day-invalido/${mealId}`)
        .set("Authorization", token)
        .send({ name: "Apple", grams: 100 })
        .expect(404);
    });

    test("falla con 404 si la comida existe pero NO pertenece al día/semana de la URL", async () => {
      // Crear otra estructura (Semana 2 -> Día 2)
      const week2 = new Week({ number_week: 2, year: 2024, user: userId });
      const savedWeek2 = await week2.save();
      const day2 = new Day({ name: "Tue", week: savedWeek2._id, user: userId });
      await day2.save();

      // Intentar usar la URL de la semana 2 para añadir a la comida de la semana 1
      await api
        .post(`/api/weeks/${savedWeek2._id}/${day2._id}/${mealId}`)
        .set("Authorization", token)
        .send({ name: "Lost Apple", grams: 100 })
        .expect(404);
    });
  });

  // ======================================================
  // PUT /:weekId/:dayId/:mealId/:mealAlimentId
  // ======================================================
  describe("PUT /api/weeks/:weekId/:dayId/:mealId/:mealAlimentId", () => {
    let alimentId;

    beforeEach(async () => {
      const aliment = new MealAliment({
        name_snapshot: "Banana",
        grams: 100,
        meal: mealId,
        user: userId,
      });
      const saved = await aliment.save();
      alimentId = saved._id;
    });

    test("actualiza los gramos correctamente", async () => {
      const response = await api
        .put(`/api/weeks/${weekId}/${dayId}/${mealId}/${alimentId}`)
        .set("Authorization", token)
        .send({ grams: 200 })
        .expect(200);

      const day = response.body.days.find((d) => d.id === dayId.toString());
      const meal = day.meals.find((m) => m.id === mealId.toString());
      const aliment = meal.aliments.find((a) => a.id === alimentId.toString());

      expect(aliment.grams).toBe(200);
    });

    test("falla con 404 si el alimento no pertenece al usuario", async () => {
      const otherUser = new mongoose.Types.ObjectId();
      const otherAliment = new MealAliment({
        name_snapshot: "Forbidden Fruit",
        grams: 100,
        meal: mealId,
        user: otherUser,
      });
      const savedOther = await otherAliment.save();

      await api
        .put(`/api/weeks/${weekId}/${dayId}/${mealId}/${savedOther._id}`)
        .set("Authorization", token)
        .send({ grams: 500 })
        .expect(404);
    });

    // Caso B: ID de Día/Comida malformado -> 404
    test("falla con 404 si dayId o mealId son malformados", async () => {
      await api
        .put(`/api/weeks/${weekId}/id-day-invalido/${mealId}/${alimentId}`)
        .set("Authorization", token)
        .send({ grams: 200 })
        .expect(404);
    });

    test("ignora intentos de cambiar nombre o calorías (solo actualiza gramos)", async () => {
      const originalName = "Banana";

      await api
        .put(`/api/weeks/${weekId}/${dayId}/${mealId}/${alimentId}`)
        .set("Authorization", token)
        .send({
          grams: 200,
          name: "Hacked Banana", // Intento de cambio
          customKcal: 9999, // Intento de cambio
        })
        .expect(200);

      const updatedAliment = await MealAliment.findById(alimentId);
      expect(updatedAliment.grams).toBe(200);
      expect(updatedAliment.name_snapshot).toBe(originalName);
    });
  });

  // ======================================================
  // DELETE /:weekId/:dayId/:mealId/:mealAlimentId
  // ======================================================
  describe("DELETE /api/weeks/:weekId/:dayId/:mealId/:mealAlimentId", () => {
    let alimentId;

    beforeEach(async () => {
      const aliment = new MealAliment({
        name_snapshot: "Cookie",
        grams: 50,
        meal: mealId,
        user: userId,
      });
      const saved = await aliment.save();
      alimentId = saved._id;
    });

    test("elimina el alimento y limpia la referencia en la comida", async () => {
      // Verificar estado inicial
      const mealBefore = await Meal.findById(mealId);
      expect(mealBefore.aliments).toHaveLength(1);

      await api
        .delete(`/api/weeks/${weekId}/${dayId}/${mealId}/${alimentId}`)
        .set("Authorization", token)
        .expect(204);

      // Verificar borrado
      const alimentAfter = await MealAliment.findById(alimentId);
      expect(alimentAfter).toBeNull();

      // Verificar referencia eliminada (Hook)
      const mealAfter = await Meal.findById(mealId);
      expect(mealAfter.aliments).toHaveLength(0);
    });

    // AQUÍ ES DIFERENTE: Como usas findById/findOneAndDelete en DELETE, Mongoose salta con CastError -> 400
    test("falla con 400 si cualquier ID es malformado", async () => {
      await api
        .delete(`/api/weeks/${weekId}/id-invalido/${mealId}/${alimentId}`)
        .set("Authorization", token)
        .expect(400);
    });

    test("falla con 404 si intentamos borrar alimento de otro usuario", async () => {
      const otherUser = new mongoose.Types.ObjectId();
      const otherAliment = new MealAliment({
        name_snapshot: "Secret Cookie",
        grams: 50,
        meal: mealId,
        user: otherUser,
      });
      const savedOther = await otherAliment.save();

      await api
        .delete(`/api/weeks/${weekId}/${dayId}/${mealId}/${savedOther._id}`)
        .set("Authorization", token)
        .expect(404);
    });
  });

  // ======================================================
  // CASCADA
  // ======================================================
  describe("Cascada: Efectos colaterales (Abuelo -> Bisnieto)", () => {
    test("Si se borra una COMIDA, sus ALIMENTOS se borran", async () => {
      const aliment = new MealAliment({
        name_snapshot: "Persistent?",
        grams: 100,
        meal: mealId,
        user: userId,
      });
      const savedAliment = await aliment.save();

      // Borramos la COMIDA
      await api
        .delete(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .expect(204);

      // El alimento debe haber desaparecido
      const alimentInDb = await MealAliment.findById(savedAliment._id);
      expect(alimentInDb).toBeNull();
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
