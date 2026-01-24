const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Week = require("../models/Week");
const Day = require("../models/Day");
const helper = require("./test_helper");

// Limpiamos la BD antes de cada test
beforeEach(async () => {
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
      .get("/api/weeks?year=2024") // Añadimos query param ya que el controller lo usa
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(0);
  });

  test("devuelve las semanas correctamente formateadas", async () => {
    const { token, userId } = await helper.getAuthToken();

    // Insertamos una semana directamente en la BD simulando que es de este usuario
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
    // Verificamos que el toJSON funcionó: number_week -> numberWeek
    expect(response.body[0].numberWeek).toBe(15);
    // Verificamos que no se devuelve info sensible o interna
    expect(response.body[0].user).toBeUndefined();
    expect(response.body[0]._id).toBeUndefined();
  });

  test("no devuelve semanas de otros usuarios (Data Isolation)", async () => {
    // 1. Crear una semana perteneciente a OTRO usuario
    const { userId: otherUserId } = await helper.getAuthToken(); // Esto resetea la BD y crea 'testuser'
    const weekOther = new Week({
      number_week: 1,
      year: 2024,
      user: otherUserId,
    });
    await weekOther.save();

    // 2. Crear UN NUEVO usuario y loguearse
    // (Sobrescribimos user y token del helper manualmente para simular el segundo usuario)
    const newUser = {
      name: "Second User",
      username: "seconduser",
      email: "second@example.com",
      password: "Password123!",
    };
    await api.post("/api/users").send(newUser);

    const loginRes = await api.post("/api/login").send({
      email: newUser.email,
      password: newUser.password,
    });
    const secondUserToken = `Bearer ${loginRes.body.token}`;

    // 3. Pedir semanas con el SEGUNDO usuario
    const response = await api
      .get("/api/weeks?year=2024")
      .set("Authorization", secondUserToken)
      .expect(200);

    // 4. Debe venir vacío (no debe ver la semana del primer usuario)
    expect(response.body).toHaveLength(0);
  });
});

describe("POST /api/weeks", () => {
  test("crea una semana válida devuelve 201", async () => {
    const { token } = await helper.getAuthToken();

    const newWeek = {
      numberWeek: 40,
      year: 2024,
    };

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

  test("falla con 400 si faltan campos requeridos (Joi)", async () => {
    const { token } = await helper.getAuthToken();

    const newWeek = {
      // Falta numberWeek
      year: 2024,
    };

    const response = await api
      .post("/api/weeks")
      .set("Authorization", token)
      .send(newWeek)
      .expect(400); // validation error

    expect(response.body.error).toBeDefined();
  });

  test("falla con 400 si el número de semana es inválido (>53)", async () => {
    const { token } = await helper.getAuthToken();

    const newWeek = {
      numberWeek: 99, // Inválido según weekSchema
      year: 2024,
    };

    await api
      .post("/api/weeks")
      .set("Authorization", token)
      .send(newWeek)
      .expect(400);
  });

  test("falla con 400 al crear una semana duplicada (unique index)", async () => {
    const { token } = await helper.getAuthToken();
    const newWeek = { numberWeek: 1, year: 2024 };

    // Primera inserción: éxito
    await api
      .post("/api/weeks")
      .set("Authorization", token)
      .send(newWeek)
      .expect(201);

    // Segunda inserción (mismos datos): fallo por duplicado
    const result = await api
      .post("/api/weeks")
      .set("Authorization", token)
      .send(newWeek)
      .expect(400); // Tu middleware captura E11000 duplicate key error

    expect(result.body.error).toMatch(/expected one of fields to be unique/i);
  });
});

describe("DELETE /api/weeks/:id", () => {
  test("elimina una semana y sus días asociados (Cascada)", async () => {
    const { token, userId } = await helper.getAuthToken();

    // 1. Crear Semana
    const week = new Week({ number_week: 10, year: 2024, user: userId });
    const savedWeek = await week.save();

    // 2. Crear Día asociado a esa semana
    // (Al guardar el día, tu hook 'post save' actualizará la semana automáticamente)
    const day = new Day({
      name: "Monday",
      week: savedWeek._id,
      user: userId,
    });
    await day.save();

    // Verificación previa: El día existe en la BD
    const dayBefore = await Day.findById(day._id);
    expect(dayBefore).toBeDefined();

    // 3. Ejecutar borrado de la Semana
    await api
      .delete(`/api/weeks/${savedWeek._id}`)
      .set("Authorization", token)
      .expect(204);

    // 4. Verificaciones Finales
    const weeksAtEnd = await helper.weeksInDb();
    expect(weeksAtEnd).toHaveLength(0);

    // BORRADO EN CASCADA: El día debe haber desaparecido
    const dayAfter = await Day.findById(day._id);
    expect(dayAfter).toBeNull();
  });

  test("falla con 404 si se intenta borrar una semana de OTRO usuario", async () => {
    const { token } = await helper.getAuthToken();

    // 1. Creamos una semana simulada de OTRO usuario
    const otherUserId = new mongoose.Types.ObjectId();
    const otherWeek = new Week({
      number_week: 5,
      year: 2024,
      user: otherUserId,
    });
    const savedOtherWeek = await otherWeek.save();

    // 2. Intentamos borrarla con nuestro token
    await api
      .delete(`/api/weeks/${savedOtherWeek._id}`)
      .set("Authorization", token)
      .expect(404); // Requiere el cambio sugerido en el controlador
  });
});

afterAll(() => {
  mongoose.connection.close();
});
