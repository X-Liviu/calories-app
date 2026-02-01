import { test, expect } from "@playwright/test";

// --- HELPER: Generador de Usuario ---
const randomUser = () => {
  const id = Date.now();
  return {
    name: "Usuario Test",
    username: `user${id}`,
    email: `user${id}@test.com`,
    password: "@1234Abc",
  };
};

test.describe("Core Loop Completo", () => {
  let user;

  // --- SETUP: REGISTRO ANTES DE CADA TEST ---
  test.beforeEach(async ({ page }) => {
    user = randomUser();
    await page.goto("/");

    // Registro rápido
    await page.getByRole("link", { name: "Sign Up" }).click();
    await page.getByRole("button", { name: "Sign Up" }).click();

    await page.getByPlaceholder("Name", { exact: true }).fill(user.name);
    await page.getByPlaceholder("Username").fill(user.username);
    await page.getByPlaceholder("E-Mail").fill(user.email);
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill(user.password);
    await page.getByPlaceholder("Repeat Password").fill(user.password);

    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(
      page.getByText("Search your number of the week"),
    ).toBeVisible();
  });

  test("Flujo: Catálogo -> Semana -> Comida -> Añadir Alimentos -> Verificar Calorías", async ({
    page,
  }) => {
    // ---------------------------------------------------------
    // PASO 1: CREAR ALIMENTO EN EL CATÁLOGO
    // ---------------------------------------------------------
    await page.getByRole("link", { name: "Catalog" }).click();

    // Rellenamos el form de MyAlimentForm.jsx
    // Usamos los placeholders definidos en tu objeto 'labels'
    await page.getByPlaceholder("Name").fill("Arroz Blanco");
    await page.getByPlaceholder("Kcal / 100g").fill("130"); // 130 kcal por 100g

    // Creamos
    await page.getByRole("button", { name: "Create" }).click();

    // Verificamos que aparece en la tabla
    await expect(page.getByText("Arroz Blanco")).toBeVisible();

    // ---------------------------------------------------------
    // PASO 2: CREAR ESTRUCTURA (SEMANA -> DÍA -> COMIDA)
    // ---------------------------------------------------------
    await page.getByRole("link", { name: "Search" }).click();

    // Crear Semana 21
    const weekNumber = "21";
    await page.getByPlaceholder("Week (1 - 53)").fill(weekNumber);
    await page.getByRole("button", { name: "Create" }).click();
    await page.getByRole("button", { name: `Week ${weekNumber}` }).click();

    // Crear Día "Martes"
    await page.getByPlaceholder("Name of the day").fill("Martes");
    await page.getByRole("button", { name: "Create Day" }).click();
    await page.getByRole("button", { name: "Martes" }).click(); // Entrar al día (navegación implícita en DayItemList)

    // Crear Comida "Cena"
    // MealForm.jsx placeholder: "Name of the meal"
    await page.getByPlaceholder("Name of the meal").fill("Cena");
    await page.getByRole("button", { name: "Create Meal" }).click();

    // Verificamos que aparece la comida (0 kcal)
    await expect(page.getByRole("heading", { name: "Cena" })).toBeVisible();

    // Entrar en la comida (click en el nombre/link)
    // En MealList.jsx el botón envuelve al componente MealItemList
    await page.getByRole("button", { name: "Cena" }).click();

    // ---------------------------------------------------------
    // PASO 3: AÑADIR ALIMENTOS
    // ---------------------------------------------------------

    // A) Añadir desde Catálogo (AlimentCatalogSelectorForm.jsx)
    // Seleccionamos "Arroz Blanco" del <select>
    // Nota: Playwright busca labels en las opciones
    await page.locator("select").selectOption({ label: "Arroz Blanco" });

    // Ponemos 200 gramos (Placeholder: "Grams of the aliment eaten")
    // Cálculo esperado: (130 kcal / 100) * 200 = 260 kcal
    await page.getByPlaceholder("Grams of the aliment eaten").fill("200");
    await page
      .getByRole("button", { name: "Add Aliment From Catalog" })
      .click();

    // B) Añadir Custom (AlimentForm.jsx)
    // Placeholders: "name", "total kcal" (minúsculas según tu código)
    await page.getByPlaceholder("name").fill("Coca Cola");
    await page.getByPlaceholder("total kcal").fill("140"); // Lata
    await page.getByRole("button", { name: "Add Custom Aliment" }).click();

    // ---------------------------------------------------------
    // PASO 4: VERIFICACIÓN FINAL (MATEMÁTICAS)
    // ---------------------------------------------------------
    // Total esperado: 260 (Arroz) + 140 (Coca Cola) = 400 kcal

    // 1. Verificar en la cabecera de la comida actual
    // MealItem.jsx pinta: <h1>Cena ...</h1> pero MealItemList pinta <h2>Cena (400 kcal)</h2>
    // Vamos a buscar el texto exacto de las calorías o un patrón.
    // Como estamos DENTRO de la comida, MealItem.jsx NO usa MealItemList, sino que pinta los hijos.
    // Pero espera, MealItem.jsx NO muestra el total de calorías en su cabecera H1,
    // ¡LO MUESTRA MealItemList cuando estás en la lista anterior!

    // Así que volvemos atrás usando el Breadcrumb o el botón de atrás del navegador.
    // Usaremos el Breadcrumb que probamos antes: "Week 21" > "Martes"
    await page.getByText("Martes").click(); // Click en el breadcrumb (o link si existe)

    // Ahora estamos en la vista del DÍA.
    // Aquí sí se usa MealItemList.jsx que pinta: <h2>Cena (400 kcal)</h2>
    await expect(
      page.getByRole("heading", { name: "Cena (400 kcal)" }),
    ).toBeVisible();

    // Y también DayItemList.jsx pinta el total del día: <h3>Martes (400 kcal)</h3>
    // Como estamos DENTRO del día, el título es <h1>Martes</h1> (DayItem.jsx),
    // PERO DayItem.jsx no calcula el total en su cabecera (solo pinta el nombre).

    // Volvamos a la semana para ver el resumen del día en la lista
    await page.getByText(`Week ${weekNumber}`).click(); // Breadcrumb atrás

    // Ahora estamos en WeekItem.jsx, que usa DayList -> DayItemList
    // Aquí sí: <h3>Martes (400 kcal)</h3>
    await expect(page.getByText("Martes (400 kcal)")).toBeVisible();

    // Volvamos al dashboard para ver el resumen de la semana
    await page.getByRole("link", { name: "Search" }).click();

    // WeekList -> WeekItemList
    // <h2>Week 21 (400 kcal)</h2>
    await expect(page.getByText(`Week ${weekNumber} (400 kcal)`)).toBeVisible();
  });
});
