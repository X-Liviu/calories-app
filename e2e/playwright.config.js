// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Lee variables de entorno si fuera necesario.
 * require('dotenv').config();
 */

module.exports = defineConfig({
  testDir: "./tests",
  /* Ejecuta tests en paralelo */
  fullyParallel: true,
  /* Falla rápido en CI si te dejas un .only */
  forbidOnly: !!process.env.CI,
  /* Reintentos: 2 en CI, 0 en local */
  retries: process.env.CI ? 2 : 0,
  /* Workers: opt-out de paralelo en CI si es necesario */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter: html para ver resultados bonitos */
  reporter: "html",

  use: {
    /* URL base: así en tus tests pones '/' en lugar de 'http://localhost:5173' */
    baseURL: "http://localhost:5173",

    /* Recolectar trazas cuando falla el test (muy útil para depurar) */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /* * CONFIGURACIÓN CLAVE: webServer
   * Playwright arrancará estos comandos antes de los tests.
   * Usamos un array para levantar Backend y Frontend a la vez.
   */
  webServer: [
    {
      // 1. BACKEND
      // Salimos de 'e2e' (cd ..) y ejecutamos el script del backend
      command: "cd .. && npm run start:test -w backend",
      port: 7000, // Puerto donde escucha tu backend (asegúrate que sea este)
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI, // En local, no lo reinicia si ya está corriendo
      stdout: "pipe", // Para ver los logs del backend en la terminal de tests
    },
    {
      // 2. FRONTEND
      // Salimos de 'e2e' y levantamos vite
      command: "cd .. && npm run dev -w frontend",
      port: 5173, // Puerto por defecto de Vite
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Puedes descomentar estos si quieres probar en más navegadores
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
