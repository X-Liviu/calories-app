const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/User");
const UserAliment = require("../models/UserAliment");
const Week = require("../models/Week");
const Day = require("../models/Day");
const helper = require("./test_helper");

beforeEach(async () => {
  await User.deleteMany({});
  await UserAliment.deleteMany({});
  await Week.deleteMany({});
  await Day.deleteMany({});
});

describe("Register /api/users", () => {
  const newUser = {
    name: "New User",
    username: "newuser",
    email: "new@example.com",
    password: "Password123!",
  };

  test("creation succeeds with fresh username and valid data", async () => {
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(1);
    expect(usersAtEnd[0].username).toBe(newUser.username);
  });

  test("creation fails with 400 if name contains invalid characters", async () => {
    const invalidNameUser = { ...newUser, name: "User1234" };
    const result = await api
      .post("/api/users")
      .send(invalidNameUser)
      .expect(400);
    expect(result.body.error).toBeDefined();
  });

  test("creation fails with 400 if password lacks special characters", async () => {
    const weakPassUser = { ...newUser, password: "PasswordNoSpecialChar1" };
    const result = await api.post("/api/users").send(weakPassUser).expect(400);
    expect(result.body.error).toBeDefined();
  });

  test("creation fails with status 400 if username already taken", async () => {
    await helper.getAuthToken(); // Crea "testuser"
    const duplicateUser = { ...newUser, username: "testuser" };

    const result = await api.post("/api/users").send(duplicateUser).expect(400);

    // ACTUALIZADO: Nuevo mensaje del middleware
    expect(result.body.error).toContain("is already taken");
  });

  test("creation fails with status 400 if email is already taken", async () => {
    await helper.getAuthToken(); // Crea usuario con email "test@example.com"
    const duplicateEmailUser = { ...newUser, email: "test@example.com" };

    const result = await api
      .post("/api/users")
      .send(duplicateEmailUser)
      .expect(400);

    // ACTUALIZADO: Nuevo mensaje del middleware
    expect(result.body.error).toContain("is already taken");
  });
});

describe("Login /api/login", () => {
  beforeEach(async () => {
    await helper.getAuthToken();
  });

  test("login succeeds with correct credentials", async () => {
    const result = await api
      .post("/api/login")
      .send({ email: "test@example.com", password: "Secret123!" })
      .expect(200);

    expect(result.body.token).toBeDefined();
    expect(result.body.username).toBe("testuser");
  });

  test("login fails with status 401 if user does not exist", async () => {
    const result = await api
      .post("/api/login")
      .send({ email: "wrong@example.com", password: "Secret123!" })
      .expect(401);
    expect(result.body.error).toBe("invalid username or password");
  });

  test("login fails with status 401 if password is wrong", async () => {
    const result = await api
      .post("/api/login")
      .send({ email: "test@example.com", password: "WrongPassword123!" })
      .expect(401);
    expect(result.body.error).toBe("invalid username or password");
  });
});

describe("User Management & Cascade Delete", () => {
  let token;
  let userId;

  beforeEach(async () => {
    const authData = await helper.getAuthToken();
    token = authData.token;
    userId = authData.userId;
  });

  test("update succeeds when changing name and username", async () => {
    const updates = { name: "Updated Name", username: "updated_user" };
    const response = await api
      .put("/api/users")
      .set("Authorization", token)
      .send(updates)
      .expect(200);
    expect(response.body.name).toBe(updates.name);
  });

  test("fails with 400 if new passwords do not match", async () => {
    const updates = {
      currentPassword: "Secret123!",
      newPassword: "NewPassword1!",
      newPasswordRepeated: "DifferentPassword1!",
    };
    const result = await api
      .put("/api/users")
      .set("Authorization", token)
      .send(updates)
      .expect(400);
    expect(result.body.error).toContain("New passwords do not match");
  });

  test("fails with 401 if current password provided is incorrect", async () => {
    const updates = {
      currentPassword: "WrongPassword!",
      newPassword: "NewPassword1!",
      newPasswordRepeated: "NewPassword1!",
    };
    const result = await api
      .put("/api/users")
      .set("Authorization", token)
      .send(updates)
      .expect(401);
    expect(result.body.error).toBe("Current password is incorrect");
  });

  test("update fails with 400 if trying to use an existing username", async () => {
    const otherUser = {
      name: "Other",
      username: "other",
      email: "other@ex.com",
      password: "Pass123!",
    };
    await api.post("/api/users").send(otherUser);

    const updates = { username: "other" };
    const result = await api
      .put("/api/users")
      .set("Authorization", token)
      .send(updates)
      .expect(400);

    // ACTUALIZADO: Nuevo mensaje
    expect(result.body.error).toContain("is already taken");
  });

  test("delete user removes ALL related data (Cascade)", async () => {
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

    const userAliment = new UserAliment({
      user: userId,
      name: "My Protein",
      nutrition_facts: { kcal_100g: 100 },
    });
    const savedAliment = await userAliment.save();

    await api.delete("/api/users").set("Authorization", token).expect(204);

    const userInDb = await User.findById(userId);
    expect(userInDb).toBeNull();
    const weekInDb = await Week.findOne({ user: userId });
    expect(weekInDb).toBeNull();
    const dayInDb = await Day.findById(day._id);
    expect(dayInDb).toBeNull();
    const alimentInDb = await UserAliment.findById(savedAliment._id);
    expect(alimentInDb).toBeNull();
  });

  test("delete user fails with 401 if token is missing", async () => {
    await api.delete("/api/users").expect(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
