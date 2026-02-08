import { describe, it, expect } from "vitest";
import {
  validateSignUpForm,
  validateLoginForm,
  validateUpdateUserForm,
  evaluatePasswordRules,
  validateDecimalInput,
} from "../../src/utils/validations";

describe("Validations Logic", () => {
  // --- LOGIN ---
  describe("validateLoginForm", () => {
    it("debe retornar error si el email es inválido", () => {
      const result = validateLoginForm({
        email: "correo-malo",
        password: "Password123",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe("E-Mail not valid");
    });

    it("debe retornar error si la password es muy corta (<8)", () => {
      const result = validateLoginForm({
        email: "test@test.com",
        password: "123",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBeDefined();
    });

    it("debe ser válido con datos correctos (Login es permisivo con complejidad)", () => {
      const result = validateLoginForm({
        email: "liviu@test.com",
        password: "Password123",
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  // --- SIGN UP ---
  describe("validateSignUpForm", () => {
    const validBaseUser = {
      name: "José María",
      username: "josem",
      email: "test@test.com",
      password: "StrongPass1!",
      passwordRepeated: "StrongPass1!",
    };

    it("debe validar correctamente un usuario completo (Happy Path)", () => {
      const result = validateSignUpForm(validBaseUser);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("debe fallar si falta el nombre", () => {
      const result = validateSignUpForm({ ...validBaseUser, name: "" });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it("debe rechazar contraseñas débiles (falta símbolo)", () => {
      const result = validateSignUpForm({
        ...validBaseUser,
        password: "Password123",
        passwordRepeated: "Password123",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toMatch(/symbol/i);
    });

    it("debe detectar si las contraseñas no coinciden", () => {
      const result = validateSignUpForm({
        ...validBaseUser,
        passwordRepeated: "OtraCosa123!",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.passwordRepeated).toMatch(/match/i);
    });

    it("debe rechazar usernames con caracteres inválidos ($)", () => {
      const result = validateSignUpForm({
        ...validBaseUser,
        username: "user$name",
      });
      expect(result.errors.username).toBeDefined();
    });
  });

  // --- UPDATE USER ---
  describe("validateUpdateUserForm", () => {
    const validUpdate = {
      name: "New Name",
      username: "newuser",
      currentPassword: "",
      newPassword: "",
      newPasswordRepeated: "",
    };

    it("debe permitir actualizar solo nombre y usuario sin tocar passwords", () => {
      const result = validateUpdateUserForm(validUpdate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("debe requerir currentPassword si se intenta cambiar la contraseña", () => {
      const result = validateUpdateUserForm({
        ...validUpdate,
        newPassword: "NewPass123!",
        newPasswordRepeated: "NewPass123!",
        currentPassword: "",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.currentPassword).toBeDefined();
    });

    it("debe validar la complejidad de la nueva contraseña", () => {
      const result = validateUpdateUserForm({
        ...validUpdate,
        currentPassword: "OldPass1!",
        newPassword: "weak",
        newPasswordRepeated: "weak",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.newPassword).toBeDefined();
    });

    it("debe validar que las nuevas contraseñas coincidan", () => {
      const result = validateUpdateUserForm({
        ...validUpdate,
        currentPassword: "OldPass1!",
        newPassword: "NewPass1!",
        newPasswordRepeated: "NewPass2!",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.newPasswordRepeated).toBeDefined();
    });
  });

  // --- PASSWORD RULES (HELPER) ---
  describe("evaluatePasswordRules", () => {
    it("debe marcar todas las reglas como true para una contraseña fuerte", () => {
      const rules = evaluatePasswordRules("StrongPass1!");
      const allValid = rules.every((r) => r.valid);
      expect(allValid).toBe(true);
    });

    it("debe fallar la regla de mayúsculas si no tiene", () => {
      const rules = evaluatePasswordRules("weakpass1!");
      const uppercaseRule = rules.find((r) => r.label.includes("uppercase"));
      expect(uppercaseRule.valid).toBe(false);
    });

    // CORRECCIÓN AQUÍ: Usamos .label.includes("8 characters") en lugar de .key === "length"
    it("debe fallar la regla de longitud si es corta", () => {
      const rules = evaluatePasswordRules("Ab1!");
      const lengthRule = rules.find((r) => r.label.includes("8 characters"));
      expect(lengthRule).toBeDefined(); // Aseguramos que la encontró
      expect(lengthRule.valid).toBe(false);
    });
  });

  // --- DECIMAL INPUT ---
  describe("validateDecimalInput", () => {
    it("debe permitir números enteros y devolverlos como string", () => {
      expect(validateDecimalInput("123")).toBe("123");
    });
    it("debe reemplazar automáticamente la coma por un punto", () => {
      expect(validateDecimalInput("12,5")).toBe("12.5");
    });
    it("debe permitir decimales escritos con punto directamente", () => {
      expect(validateDecimalInput("10.99")).toBe("10.99");
    });
    it("debe permitir string vacío", () => {
      expect(validateDecimalInput("")).toBe("");
    });
    it("debe devolver null si contiene letras", () => {
      expect(validateDecimalInput("12a")).toBeNull();
    });
    it("debe devolver null si hay múltiples puntos", () => {
      expect(validateDecimalInput("12.5.5")).toBeNull();
    });
    it("debe permitir empezar o terminar con punto", () => {
      expect(validateDecimalInput(".5")).toBe(".5");
    });
  });
});
