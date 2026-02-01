// scripts/seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MONGODB_URI } = require("../utils/config");

// Importar modelos
const User = require("../models/User");
const Week = require("../models/Week");
const Day = require("../models/Day");
const Meal = require("../models/Meal");
const MealAliment = require("../models/MealAliment");
const UserAliment = require("../models/UserAliment");
const LoginAttempt = require("../models/LoginAttempt");

mongoose.set("strictQuery", false);

const cleanData = async () => {
  console.log("🧹 Borrando base de datos completa...");
  await Promise.all([
    User.deleteMany({}),
    Week.deleteMany({}),
    Day.deleteMany({}),
    Meal.deleteMany({}),
    MealAliment.deleteMany({}),
    UserAliment.deleteMany({}),
    LoginAttempt.deleteMany({}),
  ]);
  console.log("✨ Base de datos limpia.");
};

// --- MANEJADOR DE CTRL + C (SIGINT) ---
process.on("SIGINT", async () => {
  console.log("\n\n🛑 Interrupción detectada (Ctrl + C).");
  console.log("⚠️ Procediendo a borrar todos los datos antes de salir...");

  try {
    // Si la conexión se cerró, intentamos reconectar (raro, pero preventivo)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }

    await cleanData();
    console.log("👋 Salida limpia realizada.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al limpiar en la salida:", err);
    process.exit(1);
  }
});

const seedDatabase = async () => {
  try {
    // --- LÓGICA DE ARGUMENTOS ---
    // Leemos el argumento pasado por consola (índice 2)
    const args = process.argv.slice(2);
    let weeksToGenerate = 10; // Valor por defecto si no pasan nada

    if (args.length > 0) {
      const inputWeeks = parseInt(args[0], 10);

      if (isNaN(inputWeeks) || inputWeeks < 1) {
        console.error(
          "❌ Error: El número de semanas debe ser un número entero mayor a 0.",
        );
        process.exit(1);
      }

      if (inputWeeks > 52) {
        console.warn(
          "⚠️ AVISO: El máximo permitido es 52 semanas. Se ajustará el valor a 52.",
        );
        weeksToGenerate = 52;
      } else {
        weeksToGenerate = inputWeeks;
      }
    }

    console.log("🚀 INICIANDO POBLACIÓN DE LA BD...");
    const startTime = Date.now();

    // 1. Conexión
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // 2. Limpieza TOTAL
    console.log("🧹 Borrando base de datos completa...");
    await Promise.all([
      User.deleteMany({}),
      Week.deleteMany({}),
      Day.deleteMany({}),
      Meal.deleteMany({}),
      MealAliment.deleteMany({}),
      UserAliment.deleteMany({}),
      LoginAttempt.deleteMany({}),
    ]);

    // 3. Crear Usuario
    const passwordHash = await bcrypt.hash("@1234Abc", 10);
    const user = await User.create({
      name: "Liviu",
      username: "X-Liviu",
      email: "liv@test.com",
      password_hash: passwordHash,
      registrationDate: new Date(),
    });
    console.log(`👤 Usuario creado: ${user.username}`);

    // 4. Catálogo de Alimentos
    const pantryMap = new Map();
    const rawFoods = [
      {
        name: "Pechuga de Pollo",
        nf: { kcal_100g: 165, protein_g: 31, fat_g: 3.6, carbs_g: 0 },
      },
      {
        name: "Huevos L",
        nf: { kcal_100g: 155, protein_g: 13, fat_g: 11, carbs_g: 1.1 },
      },
      {
        name: "Salmón Fresco",
        nf: { kcal_100g: 208, protein_g: 20, fat_g: 13, carbs_g: 0 },
      },
      {
        name: "Lata Atún Natural",
        nf: { kcal_100g: 100, protein_g: 23, fat_g: 1, carbs_g: 0 },
      },
      {
        name: "Ternera Magra",
        nf: { kcal_100g: 130, protein_g: 21, fat_g: 4, carbs_g: 0 },
      },
      {
        name: "Merluza",
        nf: { kcal_100g: 70, protein_g: 16, fat_g: 0.6, carbs_g: 0 },
      },
      {
        name: "Queso Fresco Batido",
        nf: { kcal_100g: 46, protein_g: 8, fat_g: 0.1, carbs_g: 3.5 },
      },
      {
        name: "Lentejas Cocidas",
        nf: { kcal_100g: 116, protein_g: 9, fat_g: 0.4, carbs_g: 20 },
      },
      {
        name: "Arroz Blanco",
        nf: { kcal_100g: 130, protein_g: 2.7, fat_g: 0.3, carbs_g: 28 },
      },
      {
        name: "Avena Copos",
        nf: { kcal_100g: 389, protein_g: 16.9, fat_g: 6.9, carbs_g: 66 },
      },
      {
        name: "Pasta Trigo",
        nf: { kcal_100g: 131, protein_g: 5, fat_g: 1.1, carbs_g: 25 },
      },
      {
        name: "Patata Cocida",
        nf: { kcal_100g: 87, protein_g: 1.9, fat_g: 0.1, carbs_g: 20 },
      },
      {
        name: "Batata/Boniato",
        nf: { kcal_100g: 86, protein_g: 1.6, fat_g: 0.1, carbs_g: 20 },
      },
      {
        name: "Pan Integral",
        nf: { kcal_100g: 250, protein_g: 9, fat_g: 3, carbs_g: 45 },
      },
      {
        name: "Tortitas de Arroz",
        nf: { kcal_100g: 380, protein_g: 8, fat_g: 2, carbs_g: 80 },
      },
      {
        name: "Aceite de Oliva",
        nf: { kcal_100g: 884, protein_g: 0, fat_g: 100, carbs_g: 0 },
      },
      {
        name: "Nueces",
        nf: { kcal_100g: 654, protein_g: 15, fat_g: 65, carbs_g: 14 },
      },
      {
        name: "Aguacate",
        nf: { kcal_100g: 160, protein_g: 2, fat_g: 15, carbs_g: 9 },
      },
      {
        name: "Crema de Cacahuete",
        nf: { kcal_100g: 590, protein_g: 25, fat_g: 50, carbs_g: 20 },
      },
      {
        name: "Salsa Tomate",
        nf: { kcal_100g: 29, protein_g: 1.3, fat_g: 0.2, carbs_g: 5 },
      },
      {
        name: "Brócoli",
        nf: { kcal_100g: 34, protein_g: 2.8, fat_g: 0.4, carbs_g: 7 },
      },
      {
        name: "Plátano",
        nf: { kcal_100g: 89, protein_g: 1.1, fat_g: 0.3, carbs_g: 23 },
      },
      {
        name: "Manzana",
        nf: { kcal_100g: 52, protein_g: 0.3, fat_g: 0.2, carbs_g: 14 },
      },
      {
        name: "Espinacas",
        nf: { kcal_100g: 23, protein_g: 2.9, fat_g: 0.4, carbs_g: 3.6 },
      },
      {
        name: "Arándanos",
        nf: { kcal_100g: 57, protein_g: 0.7, fat_g: 0.3, carbs_g: 14 },
      },
      {
        name: "Zanahoria",
        nf: { kcal_100g: 41, protein_g: 0.9, fat_g: 0.2, carbs_g: 10 },
      },
      {
        name: "Leche Semidesnatada",
        nf: { kcal_100g: 47, protein_g: 3.4, fat_g: 1.6, carbs_g: 4.9 },
      },
      {
        name: "Proteína Whey Choco",
        nf: { kcal_100g: 370, protein_g: 80, fat_g: 5, carbs_g: 4 },
      },
    ];

    // Inserción paralela
    await Promise.all(
      rawFoods.map(async (food) => {
        const createdFood = await UserAliment.create({
          user: user._id,
          name: food.name,
          nutrition_facts: food.nf,
        });
        pantryMap.set(food.name, createdFood);
      }),
    );
    console.log(`🍎 Catálogo creado (${rawFoods.length} alimentos).`);

    // --- PLANTILLA DE LA DIETA ESTÁNDAR ---
    const standardDiet = [
      {
        name: "Lunes",
        meals: [
          {
            name: "Desayuno",
            foods: [
              { item: "Avena Copos", g: 60 },
              { item: "Leche Semidesnatada", g: 250 },
              { item: "Huevos L", g: 120 },
            ],
          },
          {
            name: "Comida",
            foods: [
              { item: "Pechuga de Pollo", g: 200 },
              { item: "Arroz Blanco", g: 200 },
              { item: "Aceite de Oliva", g: 10 },
            ],
          },
          {
            name: "Cena",
            foods: [
              { item: "Salmón Fresco", g: 180 },
              { item: "Brócoli", g: 200 },
              { item: "Patata Cocida", g: 150 },
            ],
          },
        ],
      },
      {
        name: "Martes",
        meals: [
          {
            name: "Desayuno",
            foods: [
              { item: "Huevos L", g: 180 },
              { item: "Plátano", g: 100 },
            ],
          },
          {
            name: "Comida",
            foods: [
              { item: "Pasta Trigo", g: 120 },
              { item: "Lata Atún Natural", g: 100 },
              { item: "Salsa Tomate", g: 50 },
            ],
          },
          { name: "Merienda", foods: [{ item: "Nueces", g: 30 }] },
          {
            name: "Cena",
            foods: [
              { item: "Pechuga de Pollo", g: 150 },
              { item: "Brócoli", g: 300 },
            ],
          },
        ],
      },
      {
        name: "Miércoles",
        meals: [
          {
            name: "Desayuno",
            foods: [
              { item: "Pan Integral", g: 100 },
              { item: "Aceite de Oliva", g: 10 },
              { item: "Ternera Magra", g: 50 },
            ],
          },
          {
            name: "Comida",
            foods: [
              { item: "Lentejas Cocidas", g: 250 },
              { item: "Arroz Blanco", g: 100 },
              { item: "Zanahoria", g: 50 },
            ],
          },
          {
            name: "Post-Entreno",
            foods: [
              { item: "Proteína Whey Choco", g: 30 },
              { item: "Plátano", g: 100 },
            ],
          },
          {
            name: "Cena",
            foods: [
              { item: "Merluza", g: 200 },
              { item: "Espinacas", g: 150 },
              { item: "Batata/Boniato", g: 150 },
            ],
          },
        ],
      },
      {
        name: "Jueves",
        meals: [
          {
            name: "Desayuno",
            foods: [
              { item: "Queso Fresco Batido", g: 200 },
              { item: "Arándanos", g: 50 },
              { item: "Nueces", g: 20 },
            ],
          },
          {
            name: "Comida",
            foods: [
              { item: "Ternera Magra", g: 180 },
              { item: "Patata Cocida", g: 250 },
              { item: "Aguacate", g: 50 },
            ],
          },
          {
            name: "Cena",
            foods: [
              { item: "Huevos L", g: 120 },
              { item: "Lata Atún Natural", g: 50 },
            ],
          },
        ],
      },
      {
        name: "Viernes",
        meals: [
          {
            name: "Desayuno",
            foods: [
              { item: "Avena Copos", g: 50 },
              { item: "Leche Semidesnatada", g: 200 },
              { item: "Crema de Cacahuete", g: 15 },
            ],
          },
          {
            name: "Comida",
            foods: [
              { item: "Pasta Trigo", g: 150 },
              { item: "Pechuga de Pollo", g: 150 },
              { item: "Salsa Tomate", g: 60 },
            ],
          },
          {
            name: "Cena",
            foods: [
              { item: "Salmón Fresco", g: 200 },
              { item: "Espinacas", g: 200 },
            ],
          },
        ],
      },
      {
        name: "Sábado",
        meals: [
          {
            name: "Brunch",
            foods: [
              { item: "Huevos L", g: 180 },
              { item: "Aguacate", g: 80 },
              { item: "Pan Integral", g: 60 },
            ],
          },
          { name: "Cena Libre", cheat: true, foods: [] },
        ],
      },
      {
        name: "Domingo",
        meals: [
          {
            name: "Desayuno",
            foods: [
              { item: "Tortitas de Arroz", g: 40 },
              { item: "Crema de Cacahuete", g: 20 },
              { item: "Manzana", g: 150 },
            ],
          },
          {
            name: "Comida Familiar",
            foods: [
              { item: "Ternera Magra", g: 200 },
              { item: "Patata Cocida", g: 200 },
              { item: "Zanahoria", g: 100 },
            ],
          },
          {
            name: "Cena Ligera",
            foods: [
              { item: "Merluza", g: 150 },
              { item: "Brócoli", g: 200 },
            ],
          },
        ],
      },
    ];

    // --- FUNCIÓN GENERADORA ---
    const createDaysForWeek = async (weekDoc, configArray) => {
      for (const dayData of configArray) {
        const day = await Day.create({
          user: user._id,
          week: weekDoc._id,
          name: dayData.name,
        });

        // ERROR CORREGIDO AQUI:
        for (const mealData of dayData.meals) {
          const meal = await Meal.create({
            user: user._id,
            day: day._id,
            name: mealData.name,
            cheat: mealData.cheat || false,
          });

          const foodsToInsert = mealData.foods || [];
          if (foodsToInsert.length > 0) {
            // Insertamos alimentos en paralelo para este plato
            const mealAlimentPromises = foodsToInsert.map((foodInfo) => {
              if (!foodInfo.item) return null;
              const alimentDoc = pantryMap.get(foodInfo.item);
              if (!alimentDoc) return null;

              return MealAliment.create({
                user: user._id,
                meal: meal._id,
                user_aliment: alimentDoc._id,
                name_snapshot: alimentDoc.name,
                grams: foodInfo.g,
              });
            });
            await Promise.all(mealAlimentPromises);
          }
        }
      }
    };

    // 5. BUCLE MAGNO (52 SEMANAS)
    console.log("📆 Generando 10 semanas... Por favor espera.");
    const currentYear = new Date().getFullYear();

    for (let i = 1; i <= weeksToGenerate; i++) {
      console.log(`   ...procesando semana ${i}/${weeksToGenerate}`);

      const week = await Week.create({
        user: user._id,
        number_week: i,
        year: currentYear,
      });

      await createDaysForWeek(week, standardDiet);
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log("---------------------------------------------------");
    console.log(
      `✅ SEED COMPLETADO: ${weeksToGenerate} semanas generadas en ${duration.toFixed(2)} segundos.`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seed:", error);
    process.exit(1);
  }
};

seedDatabase();
