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
    await page.getByRole("link", { name: "Sign Up" }).click();
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Rellenamos el formulario (Asegúrate de mantener el 'exact: true' que arreglamos antes)
    await page.getByPlaceholder("Name", { exact: true }).fill(user.name);
    await page.getByPlaceholder("Username").fill(user.username);
    await page.getByPlaceholder("E-Mail").fill(user.email);

    // Usamos la nueva contraseña fuerte
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill(user.password);
    await page.getByPlaceholder("Repeat Password").fill(user.password);

    // Ahora el botón debería estar habilitado ("button-enabled")
    await page.getByRole("button", { name: "Confirm" }).click();

    // --- FASE 2: VERIFICAR LOGIN ---
    await expect(
      page.getByText("Search your number of the week"),
    ).toBeVisible();

    const avatar = page.getByTitle(user.username);
    await expect(avatar).toBeVisible();

    // --- FASE 3: LOGOUT ---
    await avatar.click();
    await page.getByRole("button", { name: "Logout" }).click();

    // Correcto: Verificamos que el enlace aparezca EN EL MENÚ
    await expect(
      page.locator("nav.menu").getByRole("link", { name: "Login" }),
    ).toBeVisible();

    // --- FASE 4: LOGIN MANUAL ---
    // Clicamos el ENLACE del menú
    // Esto es preciso: Solo busca en el <nav class="menu">
    await page.locator("nav.menu").getByRole("link", { name: "Login" }).click();

    // Clicamos el BOTÓN del Toggable para abrir el form
    await page.getByRole("button", { name: "Log In" }).click();

    await page.getByPlaceholder("E-Mail").fill(user.email);
    await page.getByPlaceholder("Password").fill(user.password);

    const confirmBtn = page.getByRole("button", { name: "Confirm" });
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click();

    await expect(
      page.getByText("Search your number of the week"),
    ).toBeVisible();
  });
});
