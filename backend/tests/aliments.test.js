const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const MealAliment = require("../models/MealAliment");
const Meal = require("../models/Meal");
const Day = require("../models/Day");
const Week = require("../models/Week");
const helper = require("./test_helper");

// Limpieza total
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
    const authData = await helper.getAuthToken();
    token = authData.token;
    userId = authData.userId;

    const week = new Week({ number_week: 1, year: 2024, user: userId });
    const savedWeek = await week.save();
    weekId = savedWeek._id;

    const day = new Day({ name: "Monday", week: weekId, user: userId });
    const savedDay = await day.save();
    dayId = savedDay._id;

    const meal = new Meal({ name: "Lunch", day: dayId, user: userId });
    const savedMeal = await meal.save();
    mealId = savedMeal._id;
  });

  describe("POST /:weekId/:dayId/:mealId (Añadir Alimento)", () => {
    test("añade un alimento válido y devuelve la semana completa", async () => {
      const newAliment = {
        name: "Apple",
        grams: 150,
        customKcal: 52, // Opcional
      };

      const response = await api
        .post(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send(newAliment)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Verificamos profundidad de respuesta
      const day = response.body.days.find((d) => d.id === dayId.toString());
      const meal = day.meals.find((m) => m.id === mealId.toString());
      expect(meal.aliments).toHaveLength(1);
      expect(meal.aliments[0].nameSnapshot).toBe("Apple");
      expect(meal.aliments[0].grams).toBe(150);

      // Verificamos DB
      const alimentInDb = await MealAliment.findOne({ meal: mealId });
      expect(alimentInDb).toBeDefined();
      expect(alimentInDb.name_snapshot).toBe("Apple");
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

      expect(result.body.error).toContain(
        "expected one of fields to be unique",
      );
    });

    test("falla con 404 si se intenta añadir a una comida de OTRO usuario", async () => {
      // Setup ajeno
      const otherUser = new mongoose.Types.ObjectId();
      const otherWeek = new Week({
        number_week: 5,
        year: 2024,
        user: otherUser,
      });
      await otherWeek.save();
      const otherDay = new Day({
        name: "D",
        week: otherWeek._id,
        user: otherUser,
      });
      await otherDay.save();
      const otherMeal = new Meal({
        name: "M",
        day: otherDay._id,
        user: otherUser,
      });
      await otherMeal.save();

      await api
        .post(`/api/weeks/${otherWeek._id}/${otherDay._id}/${otherMeal._id}`)
        .set("Authorization", token)
        .send({ name: "Hacker Apple", grams: 100 })
        .expect(404);
    });

    test("falla con 400 si el nombre es demasiado largo (>30 chars)", async () => {
      const longNameAliment = {
        name: "Este es un nombre de alimento absurdamente largo y debería fallar",
        grams: 100,
      };

      await api
        .post(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send(longNameAliment)
        .expect(400);
    });

    test("falla con 404 si la comida existe pero NO pertenece al día/semana de la URL", async () => {
      // 1. Crear otra estructura (Semana 2 -> Día 2)
      const week2 = new Week({ number_week: 2, year: 2024, user: userId });
      const savedWeek2 = await week2.save();
      const day2 = new Day({ name: "Tue", week: savedWeek2._id, user: userId });
      await day2.save();

      // 2. Intentar añadir alimento a 'mealId' (que es de weekId/dayId)
      // usando la ruta de la semana 2 y día 2.
      await api
        .post(`/api/weeks/${savedWeek2._id}/${day2._id}/${mealId}`) // URL incoherente
        .set("Authorization", token)
        .send({ name: "Lost Apple", grams: 100 })
        .expect(404); // El controlador no encontrará la meal dentro de day2.meals
    });
  });

  describe("PUT /:weekId/:dayId/:mealId/:mealAlimentId (Editar Gramos)", () => {
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
      // Creamos alimento ajeno (hack: lo metemos en nuestra comida para probar filtro de user en updateOne)
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
        .expect(404); // El updateOne no encontrará documento con ese ID y TU userId
    });

    test("ignora intentos de cambiar nombre o calorías (solo actualiza gramos)", async () => {
      const originalName = "Banana Suprema";
      const originalKcal = 100; // Supongamos que lo guardaste con esto si tu modelo lo permite o es default

      // Creamos un alimento base con customKcal explícito
      const aliment = new MealAliment({
        name_snapshot: originalName,
        grams: 100,
        custom_kcal: originalKcal,
        meal: mealId,
        user: userId,
      });
      const saved = await aliment.save();

      // Intentamos cambiar TODO
      await api
        .put(`/api/weeks/${weekId}/${dayId}/${mealId}/${saved._id}`)
        .set("Authorization", token)
        .send({
          grams: 200,
          name: "Hacked Banana",
          customKcal: 9999,
        })
        .expect(200);

      // Verificamos persistencia
      const updatedAliment = await MealAliment.findById(saved._id);
      expect(updatedAliment.grams).toBe(200); // Cambio aceptado
      expect(updatedAliment.name_snapshot).toBe(originalName); // Cambio ignorado
      expect(updatedAliment.custom_kcal).toBe(originalKcal); // Cambio ignorado
    });
  });

  describe("DELETE /:weekId/:dayId/:mealId/:mealAlimentId", () => {
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

    test("falla con 404 si la jerarquía de la URL no coincide con la base de datos", async () => {
      const aliment = new MealAliment({
        name_snapshot: "Ghost Cookie",
        grams: 50,
        meal: mealId,
        user: userId,
      });
      const saved = await aliment.save();

      const fakeId = new mongoose.Types.ObjectId();

      // Intentamos borrar usando un dayId falso en la URL
      await api
        .delete(`/api/weeks/${weekId}/${fakeId}/${mealId}/${saved._id}`)
        .set("Authorization", token)
        .expect(404); // Fallará al buscar el 'day' en la semana o el 'meal' en el día
    });
  });

  describe("Cascada: Efectos colaterales (Abuelo -> Bisnieto)", () => {
    test("Si se borra una COMIDA, sus ALIMENTOS se borran", async () => {
      const aliment = new MealAliment({
        name_snapshot: "Persistent?",
        grams: 100,
        meal: mealId,
        user: userId,
      });
      const savedAliment = await aliment.save();

      // Borramos la COMIDA (padre)
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
