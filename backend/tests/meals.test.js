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

  describe("POST /api/weeks/:weekId/:dayId (Crear Meal)", () => {
    test("crea una comida válida y devuelve la Semana actualizada", async () => {
      const newMeal = { name: "Breakfast" };

      const response = await api
        .post(`/api/weeks/${weekId}/${dayId}`)
        .set("Authorization", token)
        .send(newMeal)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Verificamos estructura profunda (Week -> Days -> Meals)
      const dayInResponse = response.body.days.find(
        (d) => d.id === dayId.toString(),
      );
      expect(dayInResponse).toBeDefined();
      expect(dayInResponse.meals).toHaveLength(1);
      expect(dayInResponse.meals[0].name).toBe("Breakfast");
      expect(dayInResponse.meals[0].cheat).toBe(false); // Default value

      // Verificamos persistencia en DB
      const mealInDb = await Meal.findOne({ day: dayId });
      expect(mealInDb).toBeDefined();
      expect(mealInDb.name).toBe("Breakfast");
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

      expect(result.body.error).toContain(
        "expected one of fields to be unique",
      );
    });

    test("falla con 404 si se intenta crear comida en día de OTRO usuario", async () => {
      // Simulamos semana/día de otro usuario
      const otherUserId = new mongoose.Types.ObjectId();
      const otherWeek = new Week({
        number_week: 2,
        year: 2024,
        user: otherUserId,
      });
      await otherWeek.save();
      const otherDay = new Day({
        name: "Tuesday",
        week: otherWeek._id,
        user: otherUserId,
      });
      await otherDay.save();

      // Intentamos insertar con NUESTRO token
      await api
        .post(`/api/weeks/${otherWeek._id}/${otherDay._id}`)
        .set("Authorization", token)
        .send({ name: "Hacking Lunch" })
        .expect(404); // Gracias a la corrección del controlador
    });

    test("falla con 400 si el nombre está vacío", async () => {
      await api
        .post(`/api/weeks/${weekId}/${dayId}`)
        .set("Authorization", token)
        .send({ name: "" })
        .expect(400); // Validation Error
    });

    test("falla con 404 si el día existe pero NO pertenece a la semana indicada en la URL", async () => {
      // 1. Crear otra semana del MISMO usuario
      const week2 = new Week({ number_week: 2, year: 2024, user: userId });
      const savedWeek2 = await week2.save();

      // 2. Intentar añadir comida al 'dayId' (que es de weekId) usando la ruta de 'savedWeek2'
      await api
        .post(`/api/weeks/${savedWeek2._id}/${dayId}`) // URL incoherente
        .set("Authorization", token)
        .send({ name: "Lost Meal" })
        .expect(404); // Debería decir "Day not found" (en el contexto de esa semana)
    });
  });

  describe("PUT /api/weeks/:weekId/:dayId/:mealId (Editar Cheat)", () => {
    let mealId;

    beforeEach(async () => {
      const meal = new Meal({ name: "Dinner", day: dayId, user: userId });
      const savedMeal = await meal.save();
      mealId = savedMeal._id;
    });

    test("actualiza el campo cheat correctamente", async () => {
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
        .send({ cheat: "yes" }) // Joi espera boolean
        .expect(400);
    });

    test("falla con 404 si intentamos editar una comida de OTRO usuario", async () => {
      // 1. Crear comida ajena
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

      // 2. Intentar editar con nuestro token
      await api
        .put(`/api/weeks/${otherWeek._id}/${otherDay._id}/${otherMeal._id}`)
        .set("Authorization", token)
        .send({ cheat: true })
        .expect(404);
    });

    test("ignora intentos de cambiar el nombre (solo permite cambiar cheat)", async () => {
      // Tu controlador PUT solo actualiza { cheat: cheat }. Verifiquemos eso.
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

  describe("DELETE /api/weeks/:weekId/:dayId/:mealId", () => {
    let mealId;

    beforeEach(async () => {
      const meal = new Meal({ name: "Snack", day: dayId, user: userId });
      const savedMeal = await meal.save();
      mealId = savedMeal._id;
    });

    test("elimina la comida y actualiza la referencia en el día", async () => {
      // Verificar referencia antes de borrar
      const dayBefore = await Day.findById(dayId);
      expect(dayBefore.meals).toHaveLength(1);

      await api
        .delete(`/api/weeks/${weekId}/${dayId}/${mealId}`)
        .set("Authorization", token)
        .expect(204);

      // Verificar borrado
      const mealAfter = await Meal.findById(mealId);
      expect(mealAfter).toBeNull();

      // Verificar hook (referencia eliminada del día)
      const dayAfter = await Day.findById(dayId);
      expect(dayAfter.meals).toHaveLength(0);
    });

    test("falla con 404 si intentamos borrar una comida de OTRO usuario", async () => {
      // 1. Crear comida ajena
      const otherUser = new mongoose.Types.ObjectId();
      const otherMeal = new Meal({
        name: "Secret",
        day: dayId,
        user: otherUser,
      }); // Hack: lo metemos en nuestro día para aislar el test al user del meal
      await otherMeal.save();

      // 2. Intentar borrar
      await api
        .delete(`/api/weeks/${weekId}/${dayId}/${otherMeal._id}`)
        .set("Authorization", token)
        .expect(404);
    });
  });

  describe("Cascada: Efectos colaterales", () => {
    test("Si se borra un DÍA, sus COMIDAS se borran automáticamente", async () => {
      // 1. Crear comida vinculada al día actual
      const meal = new Meal({
        name: "Transient Meal",
        day: dayId,
        user: userId,
      });
      const savedMeal = await meal.save();

      // 2. Borrar el DÍA (usando el endpoint de Días)
      await api
        .delete(`/api/weeks/${weekId}/${dayId}`)
        .set("Authorization", token)
        .expect(204);

      // 3. Verificar que la Comida ha desaparecido de la DB
      const mealInDb = await Meal.findById(savedMeal._id);
      expect(mealInDb).toBeNull();
    });
  });

  test("Si se borra una SEMANA (abuelo), las COMIDAS (nietos) se borran automáticamente", async () => {
    // 1. Crear comida vinculada
    const meal = new Meal({
      name: "Grandchild Meal",
      day: dayId,
      user: userId,
    });
    const savedMeal = await meal.save();

    // 2. Borrar la SEMANA entera
    await api
      .delete(`/api/weeks/${weekId}`)
      .set("Authorization", token)
      .expect(204);

    // 3. Verificar que la Comida ha desaparecido
    // (Week borra Day -> Day borra Meal)
    const mealInDb = await Meal.findById(savedMeal._id);
    expect(mealInDb).toBeNull();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
