const js = require("@eslint/js");
const globals = require("globals");
const reactHooks = require("eslint-plugin-react-hooks");
const reactRefresh = require("eslint-plugin-react-refresh");
const prettier = require("eslint-plugin-prettier");
const { defineConfig, globalIgnores } = require("eslint/config");

module.exports = defineConfig([
  // Ignorar carpetas globales
  globalIgnores(["dist", "node_modules", "coverage"]),

  // --- FRONTEND (React con ESM) ---
  {
    files: ["frontend/**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "comma-dangle": "off",
      "require-await": "error",
    },
  },

  // --- BACKEND (Node con CommonJS) ---
  {
    files: ["backend/**/*.js"],
    // Excluir los tests de esta regla general para evitar conflictos si fuera necesario
    // aunque la regla de abajo (TESTS) se fusionará correctamente.
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: globals.node,
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },

  // --- TESTS (Jest & Supertest) ---
  // Esta configuración aplica solo a archivos que terminen en .test.js o estén en carpetas de tests
  {
    // CAMBIO 1: Añadimos "**/*.test.jsx" para que detecte tus tests de React
    files: [
      "**/*.test.js",
      "**/*.test.jsx",
      "tests/**/*.js",
      "backend/tests/**/*.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node, // Para process.env, etc.
        ...globals.jest, // Esto arregla 'beforeEach', 'describe', 'it', 'expect'
        ...globals.browser, // Para 'document', 'window' (necesario en tests de React/jsdom)
        vi: "readonly", // Para que reconozca 'vi' (vi.mock, vi.fn)
      },
    },
  },
]);
