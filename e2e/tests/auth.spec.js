import { test, expect } from "@playwright/test";

const randomUser = () => {
  const id = Date.now();
  return {
    name: `User Test`,
    username: `user${id}`,
    email: `user${id}@test.com`,
    password: "@1234Abc",
  };
};

test.describe("Autenticación de Usuario", () => {
  test("Flujo completo: Registro -> Logout -> Login", async ({ page }) => {
    const user = randomUser();

    await page.goto("/");

    // --- FASE 1: REGISTRO ---
    await test.step("Registro de nuevo usuario", async () => {
      // 1. Abrir el formulario (Asumiendo que hay un link de navegación y luego el botón del Toggable)
      // Nota: Ajusta 'nav' si tu estructura de menú cambió.
      await page.getByRole("link", { name: "Sign Up" }).click();

      // Clic en el botón del componente Toggable para revelar el form
      await page.getByRole("button", { name: "Sign Up" }).click();

      // 2. Rellenar formulario
      // Usamos 'exact: true' para diferenciar 'Name' de 'Username' si fuera necesario,
      // y sobre todo para 'Password' vs 'Repeat Password'.
      await page.getByPlaceholder("Name", { exact: true }).fill(user.name);
      await page.getByPlaceholder("Username").fill(user.username);
      await page.getByPlaceholder("E-Mail").fill(user.email);

      await page
        .getByPlaceholder("Password", { exact: true })
        .fill(user.password);
      await page.getByPlaceholder("Repeat Password").fill(user.password);

      // 3. Confirmar registro
      // NOTA: Como tus componentes React no usan el atributo html 'disabled',
      // el botón siempre es tecnicamente "enabled" para Playwright.
      // Eliminamos el 'expect(btn).toBeEnabled()' para evitar falsos positivos o flakiness
      // hasta que se corrija el componente.
      await page.getByRole("button", { name: "Confirm" }).click();
    });

    // --- FASE 2: VERIFICAR LOGIN ---
    await test.step("Verificación de sesión iniciada", async () => {
      // Esperamos a que la redirección ocurra o el dashboard cargue
      await expect(
        page.getByPlaceholder("Search week number..."),
      ).toBeVisible();

      // Verificamos que el avatar con el username esté presente
      const avatar = page.getByTitle(user.username);
      await expect(avatar).toBeVisible();
    });

    await test.step("Cierre de sesión", async () => {
      const avatar = page.getByTitle(user.username);
      await avatar.click();

      // Esperamos que el botón de logout sea visible y clicable
      await page.getByRole("button", { name: "Logout" }).click();

      // Verificamos que hemos vuelto al estado desconectado
      // FIX: Cambiamos "nav.menu" por "nav.navbar"
      await expect(
        page.locator("nav.navbar").getByRole("link", { name: "Login" }),
      ).toBeVisible();
    });

    // --- FASE 4: LOGIN MANUAL ---
    await test.step("Re-login con credenciales creadas", async () => {
      // Navegación al Login
      // FIX: Cambiamos "nav.menu" por "nav.navbar" aquí también
      await page
        .locator("nav.navbar")
        .getByRole("link", { name: "Login" })
        .click();

      // Abrir el Toggable del Login
      await page.getByRole("button", { name: "Log In" }).click();

      await page.getByPlaceholder("E-Mail").fill(user.email);
      await page.getByPlaceholder("Password").fill(user.password);

      const confirmBtn = page.getByRole("button", { name: "Confirm" });
      await confirmBtn.click();

      // Recuerda usar el fix del placeholder que vimos en el paso anterior
      await expect(
        page.getByPlaceholder("Search week number..."),
      ).toBeVisible();
    });
  });
});
