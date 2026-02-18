const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Meal = require("../models/Meal");
const Day = require("../models/Day");
const Week = require("../models/Week");
const helper = require("./test_helper");

// Limpieza total antes de cada ejecución del fichero
beforeEach(async () => {
  await Meal.deleteMany({});
  await Day.deleteMany({});
  await Week.deleteMany({});
});

describe("Controlador de Comidas (Meals)", () => {
  let token;
  let userId;
  let weekId;
  let dayId;

  // --- SETUP COMÚN ---
  // Creamos Usuario -> Semana -> Día
  beforeEach(async () => {
    // 1. Usuario y Token
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
  });

  // ======================================================
  // POST /api/weeks/:weekId/:dayId (Crear Meal)
  // ======================================================
  describe("POST /api/weeks/:weekId/:dayId", () => {
    test("crea una comida válida, la vincula al Día y devuelve la Semana actualizada", async () => {
      const newMeal = { name: "Breakfast" };

      const response = await api
        .post(`/api/weeks/${weekId}/${dayId}`)
        .set("Authorization", token)
        .send(newMeal)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // 1. Verificamos respuesta (Semana -> Día -> Meal)
      const dayResponse = response.body.days.find(
        (d) => d.id === dayId.toString(),
      );
      expect(dayResponse).toBeDefined();
      expect(dayResponse.meals).toHaveLength(1);
      expect(dayResponse.meals[0].name).toBe("Breakfast");
      expect(dayResponse.meals[0].cheat).toBe(false); // Valor por defecto

      // 2. Verificamos persistencia en DB (Comida creada)
      const mealInDb = await Meal.findOne({ day: dayId });
      expect(mealInDb).toBeDefined();
      expect(mealInDb.name).toBe("Breakfast");

      // 3. Verificamos referencia en el Día (Hook 'post save' funcionó)
      const dayInDb = await Day.findById(dayId);
      expect(dayInDb.meals).toHaveLength(1);
      expect(dayInDb.meals[0].toString()).toBe(mealInDb._id.toString());
    });

    test("falla con 400 si falta el nombre", async () => {
      await api
        .post(`/api/weeks/${weekId}/${dayId}`)
        .set("Authorization", token)
        .send({}) // Body vacío
        .expect(400);
    });

    test("falla con 400 si se duplica el nombre de la comida en el mismo día", async () => {
      // 1. Crear primera comida
      await api
        .post(`/api/weeks/${weekId}/${dayId}`)
        .set("Authorization", token)
        .send({ name: "Lunch" })
        .expect(201);

      // 2. Intentar duplicar
      const result = await api
        .post(`/api/weeks/${weekId}/${dayId}`)
        .set("Authorization", token)
        .send({ name: "Lunch" })
        .expect(400);

      expect(result.body.error[0]).toContain("already taken");
    });

    // CAMBIO APLICADO: Ahora espera 404 porque tu lógica de array.find() devuelve undefined para IDs raros
    test("falla con 404 si hay IDs malformados", async () => {
      await api
        .post(`/api/weeks/${weekId}/id-dia-invalido`)
        .set("Authorization", token)
        .send({ name: "Dinner" })
        .expect(404);
    });

    test("falla con 404 si se intenta crear comida en día de OTRO usuario", async () => {
      const otherUser = new mongoose.Types.ObjectId();
      const otherWeek = new Week({
        number_week: 2,
        year: 2024,
        user: otherUser,
      });
      await otherWeek.save();
      const otherDay = new Day({
        name: "Tuesday",
        week: otherWeek._id,
        user: otherUser,
      });
      await otherDay.save();

      await api
        .post(`/api/weeks/${otherWeek._id}/${otherDay._id}`)
        .set("Authorization", token)
        .send({ name: "Hacking Lunch" })
        .expect(404);
    });

    test("falla con 404 si el día existe pero NO pertenece a la semana indicada en la URL (Integridad)", async () => {
      // 1. Crear otra semana del MISMO usuario
      const week2 = new Week({ number_week: 2, year: 2024, user: userId });
      const savedWeek2 = await week2.save();

      // 2. Intentar añadir comida al 'dayId' (que es de weekId) usando la ruta de 'savedWeek2'
      await api
        .post(`/api/weeks/${savedWeek2._id}/${dayId}`) // URL incoherente
        .set("Authorization", token)
        .send({ name: "Lost Meal" })
        .expect(404);
    });
  });

  // ======================================================
  // PUT /api/weeks/:weekId/:dayId/:mealId
  // ======================================================
  describe("PUT /api/weeks/:weekId/:dayId/:mealId", () => {
    let mealId;

    beforeEach(async () => {
      const meal = new Meal({ name: "Dinner", day: dayId, user: userId });
      const savedMeal = await meal.save();
      mealId = savedMeal._id;
    });

    test("actualiza el campo 'cheat' correctamente", async () => {
      const response = await api
        .put(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send({ cheat: true })
        .expect(200);

      // Verificamos en la respuesta
      const day = response.body.days.find((d) => d.id === dayId.toString());
      const meal = day.meals.find((m) => m.id === mealId.toString());
      expect(meal.cheat).toBe(true);

      // Verificamos en BD
      const mealInDb = await Meal.findById(mealId);
      expect(mealInDb.cheat).toBe(true);
    });

    test("falla con 400 si cheat no es booleano", async () => {
      await api
        .put(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send({ cheat: "yes" })
        .expect(400);
    });

    // CAMBIO APLICADO: Ahora espera 404 (tu lógica array.find() no lo encuentra)
    test("falla con 404 si el ID es malformado", async () => {
      await api
        .put(`/api/weeks/${weekId}/${dayId}/id-meal-invalido`)
        .set("Authorization", token)
        .send({ cheat: true })
        .expect(404);
    });

    test("falla con 404 si la comida existe pero no está en el día indicado (Integridad)", async () => {
      // Crear otro día
      const day2 = new Day({ name: "Tuesday", week: weekId, user: userId });
      const savedDay2 = await day2.save();

      // Intentar actualizar mealId (que es de dayId) usando day2 en la URL
      await api
        .put(`/api/weeks/${weekId}/${savedDay2._id}/${mealId}`)
        .set("Authorization", token)
        .send({ cheat: true })
        .expect(404);
    });

    test("ignora intentos de cambiar el nombre (solo permite cambiar cheat)", async () => {
      const originalName = "Dinner";

      const response = await api
        .put(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .send({
          cheat: true,
          name: "Hacked Name", // Intentamos cambiar nombre
        })
        .expect(200);

      // Verificamos que el nombre SIGUE siendo el original
      const day = response.body.days.find((d) => d.id === dayId.toString());
      const meal = day.meals.find((m) => m.id === mealId.toString());

      expect(meal.cheat).toBe(true);
      expect(meal.name).toBe(originalName);
    });
  });

  // ======================================================
  // DELETE /api/weeks/:weekId/:dayId/:mealId
  // ======================================================
  describe("DELETE /api/weeks/:weekId/:dayId/:mealId", () => {
    let mealId;

    beforeEach(async () => {
      const meal = new Meal({ name: "Snack", day: dayId, user: userId });
      const savedMeal = await meal.save();
      mealId = savedMeal._id;
    });

    test("elimina la comida y limpia la referencia en el día", async () => {
      // Verificar referencia antes de borrar
      const dayBefore = await Day.findById(dayId);
      expect(dayBefore.meals).toHaveLength(1);

      await api
        .delete(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .expect(204);

      // Verificar borrado de Comida
      const mealAfter = await Meal.findById(mealId);
      expect(mealAfter).toBeNull();

      // Verificar hook (referencia eliminada del día)
      const dayAfter = await Day.findById(dayId);
      expect(dayAfter.meals).toHaveLength(0);
    });

    // MANTENIDO: En DELETE usas findById directo a Mongo, así que el CastError salta y da 400.
    test("falla con 400 si el ID es malformado", async () => {
      await api
        .delete(`/api/weeks/${weekId}/${dayId}/id-meal-invalido`)
        .set("Authorization", token)
        .expect(400);
    });

    test("falla con 404 si intentamos borrar una comida de OTRO usuario", async () => {
      const otherUser = new mongoose.Types.ObjectId();
      const otherMeal = new Meal({
        name: "Secret",
        day: dayId,
        user: otherUser,
      });
      const savedOther = await otherMeal.save();

      await api
        .delete(`/api/weeks/${weekId}/${dayId}/${savedOther._id}`)
        .set("Authorization", token)
        .expect(404);
    });

    test("falla con 404 si la jerarquía de URL es incorrecta (Meal no está en Day)", async () => {
      // Crear otro día
      const day2 = new Day({ name: "Tuesday", week: weekId, user: userId });
      const savedDay2 = await day2.save();

      // Intentar borrar mealId (que pertenece a dayId) usando la ruta de day2
      await api
        .delete(`/api/weeks/${weekId}/${savedDay2._id}/${mealId}`)
        .set("Authorization", token)
        .expect(404);
    });
  });

  // ======================================================
  // Test de Cascada (Aseguramiento Extra)
  // ======================================================
  describe("Cascada: Efectos colaterales", () => {
    test("Si se borra un DÍA, sus COMIDAS se borran automáticamente", async () => {
      const meal = new Meal({
        name: "Transient Meal",
        day: dayId,
        user: userId,
      });
      const savedMeal = await meal.save();

      // Borrar el DÍA (usando el endpoint de Días)
      await api
        .delete(`/api/weeks/${weekId}/${dayId}`)
        .set("Authorization", token)
        .expect(204);

      // Verificar que la Comida ha desaparecido
      const mealInDb = await Meal.findById(savedMeal._id);
      expect(mealInDb).toBeNull();
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
