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
  test.beforeEach(async ({ page }) => {
    // Setup rápido: Crear usuario
    const user = randomUser();
    await page.goto("/");
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

  test("Catálogo: Debe permitir editar celdas (Inline Edit) y borrar alimentos", async ({
    page,
  }) => {
    // 1. Ir al Catálogo y crear un alimento
    await page
      .locator("nav.menu")
      .getByRole("link", { name: "Catalog" })
      .click();

    const foodName = "Avena";
    await page.getByPlaceholder("Name").fill(foodName);
    await page.getByPlaceholder("Kcal / 100g").fill("350");
    await page.getByRole("button", { name: "Create" }).click();

    // Verificamos que existe en la tabla
    await expect(page.getByRole("cell", { name: foodName })).toBeVisible();

    // 2. PRUEBA DE EDICIÓN EN LÍNEA
    // CORRECCIÓN 1: Usamos locator en lugar de getByDisplayValue
    const kcalInput = page.locator('input[value="350"]');
    await expect(kcalInput).toBeVisible();

    // Click para enfocar (activa la edición)
    await kcalInput.click();

    // Escribimos el nuevo valor
    await kcalInput.fill("400");

    // Disparamos el guardado pulsando ENTER
    await kcalInput.press("Enter");

    // 3. VERIFICAR PERSISTENCIA (Reload)
    await page.reload();

    // CORRECCIÓN 2: Aquí también cambiamos los expect que fallaban
    // Antes: await expect(page.getByDisplayValue("400")).toBeVisible();
    await expect(page.locator('input[value="400"]')).toBeVisible();

    // Antes: await expect(page.getByDisplayValue("350")).not.toBeVisible();
    await expect(page.locator('input[value="350"]')).not.toBeVisible();

    // 4. BORRADO DE ALIMENTO
    const row = page.getByRole("row").filter({ hasText: foodName });
    await row.getByRole("button", { name: "❌" }).click();

    // Verificamos que desaparece
    await expect(page.getByText(foodName)).not.toBeVisible();
  });

  test("Historial: Borrar una semana debe eliminarla permanentemente", async ({
    page,
  }) => {
    // 1. Crear semana 50
    await page.getByPlaceholder("Week (1 - 53)").fill("50");
    await page.getByRole("button", { name: "Create" }).click();

    const weekBtn = page.getByRole("button", { name: "Week 50" });
    await expect(weekBtn).toBeVisible();

    // 2. Borrar semana
    const row = page.getByRole("row").filter({ hasText: "Week 50" });
    await row.getByRole("button", { name: "❌" }).click();

    // Confirmar en modal
    await page.getByRole("button", { name: "Yes, I confirm." }).click();

    // 3. Verificar desaparición visual
    await expect(weekBtn).not.toBeVisible();

    // 4. Verificar persistencia (que no vuelva al recargar)
    await page.reload();
    await expect(
      page.getByRole("button", { name: "Week 50" }),
    ).not.toBeVisible();
  });
});
