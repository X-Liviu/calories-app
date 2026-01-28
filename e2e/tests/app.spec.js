import { test, expect } from "@playwright/test";

test("La aplicación carga correctamente", async ({ page }) => {
  // 1. Ir a la home
  await page.goto("/");

  // 2. CORRECCIÓN: Verificar que el título es "TrackBites"
  // Playwright esperará hasta que el título contenga esa palabra
  await expect(page).toHaveTitle(/TrackBites/);

  // 3. Verificar que vemos el Login (ya que no estamos autenticados)
  await expect(page.getByText("Login")).toBeVisible();
});
