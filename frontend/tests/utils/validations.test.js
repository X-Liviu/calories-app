import { describe, it, expect } from "vitest";
import {
  validateSignUpForm,
  validateLoginForm,
  evaluatePasswordRules,
} from "../../src/utils/validations";

describe("Validations Logic", () => {
  describe("validateLoginForm", () => {
    it("debe retornar error si el email es inválido", () => {
      const result = validateLoginForm({
        email: "correo-malo",
        password: "Password123",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe("E-Mail not valid");
    });

    it("debe retornar error si la password es muy corta", () => {
      const result = validateLoginForm({
        email: "test@test.com",
        password: "123", // Muy corta
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBeDefined();
    });

    it("debe ser válido con datos correctos", () => {
      const result = validateLoginForm({
        email: "liviu@test.com",
        password: "Password123",
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe("validateSignUpForm", () => {
    it("debe validar correctamente un nombre con acentos y espacios", () => {
      const result = validateSignUpForm({
        name: "José María", // Caso borde común
        username: "josem",
        email: "test@test.com",
        password: "Pass123!",
        passwordRepeated: "Pass123!",
      });
      // Si tu regex de nombre soporta tildes, esto debe ser true
      // Si falla, ¡acabas de descubrir un bug en tu regex!
      expect(result.errors.name).toBeUndefined();
    });

    it("debe detectar si las contraseñas no coinciden", () => {
      const result = validateSignUpForm({
        name: "User",
        username: "user",
        email: "test@test.com",
        password: "Pass123!",
        passwordRepeated: "Pass1234", // Diferente
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.passwordRepeated).toMatch(/match/i);
    });

    it("debe rechazar usernames con caracteres inválidos", () => {
      const result = validateSignUpForm({
        name: "User",
        username: "user$name", // Símbolo no permitido
        email: "test@test.com",
        password: "Pass123!",
        passwordRepeated: "Pass123!",
      });
      expect(result.errors.username).toBeDefined();
    });
  });

  describe("evaluatePasswordRules", () => {
    it("debe marcar todas las reglas como true para una contraseña fuerte", () => {
      const rules = evaluatePasswordRules("StrongPass1!");
      const allValid = rules.every((r) => r.valid);
      expect(allValid).toBe(true);
    });

    it("debe fallar la regla de mayúsculas si no tiene", () => {
      const rules = evaluatePasswordRules("weakpass1!");

      const uppercaseRule = rules.find((r) => r.label.includes("uppercase"));

      expect(uppercaseRule).toBeDefined();
      expect(uppercaseRule.valid).toBe(false);
    });
  });
});
