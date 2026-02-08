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

    // Abrir Toggable
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Rellenar formulario
    await page.getByPlaceholder("Name", { exact: true }).fill(user.name);
    await page.getByPlaceholder("Username").fill(user.username);
    await page.getByPlaceholder("E-Mail").fill(user.email);

    // Contraseñas
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill(user.password);
    await page.getByPlaceholder("Repeat Password").fill(user.password);

    // Confirmar
    await page.getByRole("button", { name: "Confirm" }).click();

    // VERIFICACIÓN DEL SETUP CORREGIDA:
    // Esperamos a ver el input de búsqueda del Dashboard para confirmar login exitoso.
    await expect(page.getByPlaceholder("Search week number...")).toBeVisible();
  });

  test("Flujo: Catálogo -> Semana -> Comida -> Añadir Alimentos -> Verificar Calorías", async ({
    page,
  }) => {
    // ---------------------------------------------------------
    // PASO 1: CREAR ALIMENTO EN EL CATÁLOGO
    // ---------------------------------------------------------
    // Navegación corregida (Link en Menu.jsx es "Catalog")
    await page.getByRole("link", { name: "Catalog" }).click();

    // Rellenamos el form de MyAlimentForm.jsx
    // CORRECCIÓN: Usamos getByLabel porque los placeholders numéricos son todos "0" (ambiguos).
    // Las labels están definidas en el objeto 'labels' de tu componente.
    await page.getByLabel("Product Name").fill("Arroz Blanco");
    await page.getByLabel("Kcal / 100g").fill("130"); // 130 kcal por 100g

    await page.getByRole("button", { name: "Add to Catalog" }).click();

    // Verificamos que aparece en la tabla (MyAlimentList -> MyAlimentItemList)
    // Usamos una celda específica para asegurar que se renderizó en la tabla.
    await expect(
      page.getByRole("cell", { name: "Arroz Blanco" }),
    ).toBeVisible();

    // ---------------------------------------------------------
    // PASO 2: CREAR ESTRUCTURA (SEMANA -> DÍA -> COMIDA)
    // ---------------------------------------------------------
    await page.getByRole("link", { name: "Search" }).click();

    // 1. Crear Semana 21
    const weekNumber = "21";
    // Nuevo Placeholder exacto según WeekForm.jsx
    await page.getByPlaceholder("New Week (1 - 53)").fill(weekNumber);
    // Nuevo texto del botón: "Add"
    await page.getByRole("button", { name: "Add", exact: true }).click();

    // ¡NUEVO! Confirmar en el Modal (WeekForm usa AddConfirmationModal)
    await page.getByRole("button", { name: "Yes, Create" }).click();

    // Navegar entrando en la semana (Click en la tarjeta creada)
    await page.getByText(`Week ${weekNumber}`).click();

    // 2. Crear Día "Martes"
    // Nuevo Placeholder exacto según DayForm.jsx
    await page.getByPlaceholder("Name of the day (e.g. Monday)").fill("Martes");
    await page.getByRole("button", { name: "Add Day" }).click();

    // ¡NUEVO! Confirmar en el Modal (DayForm usa AddConfirmationModal)
    await page.getByRole("button", { name: "Yes, Create" }).click();

    // Navegar entrando en el día
    await page.getByText("Martes").click();

    // 3. Crear Comida "Cena"
    // Nuevo Placeholder exacto según MealForm.jsx
    await page
      .getByPlaceholder("Name of the meal (e.g. Breakfast)")
      .fill("Cena");

    // Nuevo texto del botón: "Add Meal"
    // Nota: MealForm NO tiene modal, así que no esperamos confirmación extra.
    await page.getByRole("button", { name: "Add Meal" }).click();

    // Verificamos que aparece la comida (0 kcal al inicio)
    // MealItemList.jsx muestra: "Cena" y debajo "0 kcal"
    await expect(page.getByText("Cena")).toBeVisible();

    // Entrar en la comida (Navegación para el siguiente paso)
    await page.getByText("Cena").click();

    // ---------------------------------------------------------
    // PASO 3: AÑADIR ALIMENTOS
    // ---------------------------------------------------------

    // A) Añadir desde Catálogo (AlimentCatalogSelectorForm.jsx)
    // Seleccionamos "Arroz Blanco" del <select> usando su label asociada "Select Item:"
    await page
      .getByLabel("Select Item:")
      .selectOption({ label: "Arroz Blanco" });

    // Ponemos 200 gramos (Placeholder exacto: "Grams eaten (e.g. 100)")
    // Cálculo esperado: (130 kcal / 100) * 200 = 260 kcal
    await page.getByPlaceholder("Grams eaten (e.g. 100)").fill("200");

    // Botón exacto: "Add from Catalog"
    await page.getByRole("button", { name: "Add from Catalog" }).click();

    // Verificación rápida opcional: Que el alimento aparezca en la lista
    // AlimentItemList.jsx muestra el nombre en div.aliment-name
    await expect(
      page.locator(".aliment-name").filter({ hasText: "Arroz Blanco" }),
    ).toBeVisible();

    // B) Añadir Custom (AlimentForm.jsx)
    // Placeholders exactos según el código de AlimentForm.jsx
    await page.getByPlaceholder("Aliment Name").fill("Coca Cola");
    await page.getByPlaceholder("Grams (Optional)").fill("330"); // Lata estándar
    await page.getByPlaceholder("Total Kcal").fill("140"); // 140 kcal totales

    // Botón exacto: "Add Custom Aliment"
    await page.getByRole("button", { name: "Add Custom Aliment" }).click();

    // Verificación rápida opcional
    await expect(
      page.locator(".aliment-name").filter({ hasText: "Coca Cola" }),
    ).toBeVisible();

    // ---------------------------------------------------------
    // PASO 4: VERIFICACIÓN FINAL (MATEMÁTICAS)
    // ---------------------------------------------------------
    // Total esperado: 260 (Arroz) + 140 (Coca Cola) = 400 kcal

    // 1. Verificar Meal (Cena) en la lista del Día
    // Navegamos atrás usando el Breadcrumb
    await page.getByRole("link", { name: "Martes" }).click();

    // Buscacamos la tarjeta (article) que contiene "Cena"
    const mealCard = page.locator("article").filter({ hasText: "Cena" });

    // Verificamos que DENTRO de esa tarjeta, el contador de calorías marque 400
    await expect(mealCard.locator(".meal-card-calories")).toHaveText(
      "400 kcal",
    );

    // 2. Verificar Day (Martes) en la lista de la Semana
    // Navegamos atrás al nivel de Semana
    await page.getByRole("link", { name: `Week ${weekNumber}` }).click();

    // Buscamos la tarjeta del día "Martes"
    const dayCard = page.locator("article").filter({ hasText: "Martes" });

    // Verificamos el total del día
    await expect(dayCard.locator(".day-card-calories")).toHaveText("400 kcal");

    // 3. Verificar Week (21) en el Dashboard principal
    // Navegamos al inicio (Search)
    await page.getByRole("link", { name: "Search" }).click();

    // Buscamos la tarjeta de la semana 21
    const weekCard = page
      .locator("article")
      .filter({ hasText: `Week ${weekNumber}` });

    // Verificamos el total de la semana (clase específica .week-calories)
    await expect(weekCard.locator(".week-calories")).toHaveText("400 kcal");
  });
});
