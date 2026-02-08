import { test, expect } from "@playwright/test";

const randomUser = () => {
  const id = Date.now();
  return {
    name: "User Management",
    username: `mgmt${id}`,
    email: `mgmt${id}@test.com`,
    password: "@1234Abc",
  };
};

test.describe("Gestión: Catálogo y Persistencia", () => {
  // --- SETUP: REGISTRO NUEVO (Igual que en core.spec.js) ---
  test.beforeEach(async ({ page }) => {
    const user = randomUser();
    await page.goto("/");

    // Abrir modal y registrarse
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

    // Verificación de login exitoso (Input de búsqueda)
    await expect(page.getByPlaceholder("Search week number...")).toBeVisible();
  });

  test("Catálogo: Debe permitir editar celdas (Inline Edit) y borrar alimentos", async ({
    page,
  }) => {
    // 1. Ir al Catálogo
    // Corrección: nav.navbar en lugar de nav.menu
    await page
      .locator("nav.navbar")
      .getByRole("link", { name: "Catalog" })
      .click();

    // 2. Crear un alimento
    const foodName = "Avena";
    // Corrección: Usamos getByLabel (best practice) o los nuevos placeholders si no hubiera label
    await page.getByLabel("Product Name").fill(foodName);
    await page.getByLabel("Kcal / 100g").fill("350");

    // Corrección: Botón actualizado "Add to Catalog"
    await page.getByRole("button", { name: "Add to Catalog" }).click();

    // Verificamos que existe en la tabla (buscando la celda con el nombre)
    await expect(page.getByRole("cell", { name: foodName })).toBeVisible();

    // 3. PRUEBA DE EDICIÓN EN LÍNEA
    // ESTRATEGIA ROBUSTA:
    // 1. Buscamos la fila por el nombre del alimento (estable)
    const row = page.getByRole("row").filter({ hasText: foodName });

    // 2. Buscamos el primer input dentro de esa fila (que corresponde a Kcal)
    // Esto asegura que el selector siga funcionando aunque cambie el valor numérico.
    const kcalInput = row.locator("input").first();

    // Verificamos estado inicial
    await expect(kcalInput).toHaveValue("350");

    // Click para enfocar (importante para tu lógica de readOnly/onFocus en React)
    await kcalInput.click();

    // Editamos
    await kcalInput.fill("400");

    // Ahora .press funciona porque 'kcalInput' sigue apuntando al mismo elemento DOM
    await kcalInput.press("Enter");

    // 4. VERIFICAR PERSISTENCIA (Reload)
    await page.reload();

    // Verificamos persistencia buscando de nuevo la fila y el valor esperado
    const rowAfterReload = page.getByRole("row").filter({ hasText: foodName });
    await expect(rowAfterReload.locator("input").first()).toHaveValue("400");

    // 5. BORRADO DE ALIMENTO
    // Estrategia: Buscar la fila que contiene el nombre del alimento
    const row2 = page.getByRole("row").filter({ hasText: foodName });

    // Dentro de esa fila, buscamos el botón de borrar por su 'title' (accesibilidad)
    // En MyAlimentItemList.jsx: title="Delete Item"
    await row2.getByTitle("Delete Item").click();

    await expect(page.getByText(foodName)).not.toBeVisible();
  });

  test("Historial: Borrar una semana debe eliminarla permanentemente", async ({
    page,
  }) => {
    // 1. Crear semana 50
    // Corrección: Placeholder actualizado
    await page.getByPlaceholder("New Week (1 - 53)").fill("50");
    // Corrección: Botón "Add"
    await page.getByRole("button", { name: "Add", exact: true }).click();

    // Corrección: CONFIRMAR MODAL DE CREACIÓN
    await page.getByRole("button", { name: "Yes, Create" }).click();

    // Verificamos visualmente (WeekList usa cards con h3)
    const weekCard = page.locator("article").filter({ hasText: "Week 50" });
    await expect(weekCard).toBeVisible();

    // 2. Borrar semana
    // Buscamos el botón "Delete week" (title) DENTRO de la tarjeta de la semana 50
    await weekCard.getByTitle("Delete week").click();

    // 3. Confirmar en MODAL DE BORRADO
    // El texto del botón en DeleteConfirmationModal es "Yes, Delete"
    await page.getByRole("button", { name: "Yes, Delete" }).click();

    // 4. Verificar desaparición visual
    await expect(weekCard).not.toBeVisible();

    // 5. Verificar persistencia (que no vuelva al recargar)
    await page.reload();
    await expect(
      page.locator("article").filter({ hasText: "Week 50" }),
    ).not.toBeVisible();
  });
});
