import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Ignorar carpetas globales
  globalIgnores(["dist", "node_modules"]),

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
      sourceType: "module", // Aquí ESM
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },

  // --- BACKEND (Node con CommonJS) ---
  {
    files: ["backend/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // Aquí CommonJS
      globals: globals.node,
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
]);
