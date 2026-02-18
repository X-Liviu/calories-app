const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const UserAliment = require("../models/UserAliment");
const helper = require("./test_helper");

// Helper para crear objeto nutricional completo (requerido por Joi strict mode)
const fullNutrition = (overrides = {}) => ({
  kcal100G: 0,
  fatG: 0,
  saturatedFatG: 0,
  carbsG: 0,
  sugarG: 0,
  fiberG: 0,
  proteinG: 0,
  saltG: 0,
  ...overrides,
});

// Limpieza inicial
beforeEach(async () => {
  await UserAliment.deleteMany({});
});

describe("Controlador de UserAliments (Mi Despensa)", () => {
  let token;
  let userId;

  // Setup: Creamos usuario y obtenemos token antes de cada test
  beforeEach(async () => {
    const authData = await helper.getAuthToken();
    token = authData.token;
    userId = authData.userId;
  });

  // ======================================================
  // 1. GET - Obtener alimentos
  // ======================================================
  describe("GET /api/my-aliments", () => {
    test("falla con 401 si no se provee token", async () => {
      await api.get("/api/my-aliments").expect(401);
    });

    test("devuelve lista vacía inicialmente", async () => {
      const response = await api
        .get("/api/my-aliments")
        .set("Authorization", token)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveLength(0);
    });

    test("devuelve los alimentos creados por el usuario (transformación camelCase)", async () => {
      const aliment = new UserAliment({
        user: userId,
        name: "My Protein",
        nutrition_facts: { kcal_100g: 300, protein_g: 80 },
      });
      await aliment.save();

      const response = await api
        .get("/api/my-aliments")
        .set("Authorization", token)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("My Protein");
      expect(response.body[0].nutritionFacts.kcal100G).toBe(300);
      expect(response.body[0].nutritionFacts.proteinG).toBe(80);
    });
  });

  // ======================================================
  // 2. POST - Crear alimentos
  // ======================================================
  describe("POST /api/my-aliments", () => {
    test("crea un alimento válido y transforma camelCase a snake_case en DB", async () => {
      // CORRECCIÓN: Joi requiere TODOS los campos nutricionales ahora
      const newAliment = {
        name: "Oats",
        nutritionFacts: fullNutrition({
          kcal100G: 350,
          carbsG: 60,
          fatG: 5,
        }),
      };

      const response = await api
        .post("/api/my-aliments")
        .set("Authorization", token)
        .send(newAliment)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(response.body.name).toBe("Oats");

      // Verificación directa en base de datos
      const inDb = await UserAliment.findOne({ user: userId });
      expect(inDb.nutrition_facts.kcal_100g).toBe(350);
      expect(inDb.nutrition_facts.carbs_g).toBe(60);
    });

    test("falla con 400 si falta el nombre", async () => {
      const invalidAliment = {
        // name: missing
        nutritionFacts: fullNutrition({ kcal100G: 100 }),
      };

      const result = await api
        .post("/api/my-aliments")
        .set("Authorization", token)
        .send(invalidAliment)
        .expect(400);

      // CORRECCIÓN: Al validar 'name' directamente con Joi (catalogNameSchema.validateAsync(name)),
      // si name es undefined, Joi devuelve "value" is required.
      // O puedes buscar simplemente "required"
      expect(JSON.stringify(result.body.error)).toContain("required");
    });

    test("falla con 400 si falta el objeto nutritionFacts (Controller Check)", async () => {
      const invalidAliment = { name: "Air" };

      const result = await api
        .post("/api/my-aliments")
        .set("Authorization", token)
        .send(invalidAliment)
        .expect(400);

      // CORRECCIÓN: El middleware devuelve un array. Buscamos el string exacto.
      expect(result.body.error).toContain(
        "nutritionFacts is required and must be an object",
      );
    });

    test("falla con 400 si Joi detecta tipos incorrectos", async () => {
      const invalidData = {
        name: "Bad Input",
        nutritionFacts: fullNutrition({
          kcal100G: "muchas calorías", // Debe ser número
        }),
      };

      await api
        .post("/api/my-aliments")
        .set("Authorization", token)
        .send(invalidData)
        .expect(400);
    });

    test("falla con 400 al intentar crear duplicado (Unique Index)", async () => {
      // CORRECCIÓN: Necesitamos un objeto válido completo para que el primer POST funcione
      const aliment = {
        name: "Milk",
        nutritionFacts: fullNutrition({ kcal100G: 50 }),
      };

      // Primer insert
      await api
        .post("/api/my-aliments")
        .set("Authorization", token)
        .send(aliment)
        .expect(201);

      // Segundo insert (duplicado)
      const result = await api
        .post("/api/my-aliments")
        .set("Authorization", token)
        .send(aliment)
        .expect(400);

      expect(result.body.error).toContain("The name is already taken");
    });
  });

  // ======================================================
  // 3. PUT - Actualizar alimentos
  // ======================================================
  describe("PUT /api/my-aliments/:id", () => {
    let alimentId;

    beforeEach(async () => {
      const aliment = new UserAliment({
        user: userId,
        name: "Rice",
        nutrition_facts: { kcal_100g: 130, carbs_g: 28 },
      });
      const saved = await aliment.save();
      alimentId = saved._id;
    });

    test("actualiza un campo específico correctamente", async () => {
      const updateData = { proteinG: 5 }; // camelCase

      const response = await api
        .put(`/api/my-aliments/${alimentId}`)
        .set("Authorization", token)
        .send(updateData)
        .expect(200);

      expect(response.body.nutritionFacts.proteinG).toBe(5);
      expect(response.body.nutritionFacts.kcal100G).toBe(130); // El resto sigue igual

      // Verificar persistencia
      const inDb = await UserAliment.findById(alimentId);
      expect(inDb.nutrition_facts.protein_g).toBe(5);
    });

    test("falla con 400 si se envía un campo desconocido (Validación Manual)", async () => {
      await api
        .put(`/api/my-aliments/${alimentId}`)
        .set("Authorization", token)
        .send({ unknownField: 100 })
        .expect(400);
    });

    test("falla con 400 si el ID es malformado (CastError)", async () => {
      const malformedId = "12345";

      await api
        .put(`/api/my-aliments/${malformedId}`)
        .set("Authorization", token)
        .send({ proteinG: 10 })
        .expect(400);
    });

    test("falla con 404 si el alimento existe pero es de OTRO usuario", async () => {
      const otherUser = new mongoose.Types.ObjectId();
      const otherAliment = new UserAliment({
        user: otherUser,
        name: "Other's Rice",
        nutrition_facts: { kcal_100g: 100 },
      });
      const savedOther = await otherAliment.save();

      await api
        .put(`/api/my-aliments/${savedOther._id}`)
        .set("Authorization", token)
        .send({ kcal100G: 999 })
        .expect(404);
    });
  });

  // ======================================================
  // 4. DELETE - Borrar alimentos
  // ======================================================
  describe("DELETE /api/my-aliments/:id", () => {
    test("elimina el alimento correctamente", async () => {
      const aliment = new UserAliment({
        user: userId,
        name: "To Delete",
        nutrition_facts: {},
      });
      const saved = await aliment.save();

      await api
        .delete(`/api/my-aliments/${saved._id}`)
        .set("Authorization", token)
        .expect(204);

      const inDb = await UserAliment.findById(saved._id);
      expect(inDb).toBeNull();
    });

    test("falla con 400 si el ID es malformado", async () => {
      await api
        .delete("/api/my-aliments/id-invalido-texto")
        .set("Authorization", token)
        .expect(400);
    });

    test("falla con 404 si intenta borrar alimento ajeno", async () => {
      const otherUser = new mongoose.Types.ObjectId();
      const otherAliment = new UserAliment({
        user: otherUser,
        name: "Secret",
        nutrition_facts: {},
      });
      const savedOther = await otherAliment.save();

      await api
        .delete(`/api/my-aliments/${savedOther._id}`)
        .set("Authorization", token)
        .expect(404);
    });

    test("falla con 404 si el alimento no existe", async () => {
      const validNonExistentId = new mongoose.Types.ObjectId();

      await api
        .delete(`/api/my-aliments/${validNonExistentId}`)
        .set("Authorization", token)
        .expect(404);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
