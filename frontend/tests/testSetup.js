import "@testing-library/jest-dom";

// Aquí limpiaremos los mocks automáticamente después de cada test
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Ejecuta cleanup después de cada test case (ej: it, test)
afterEach(() => {
  cleanup();
});
