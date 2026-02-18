import {
  setUser,
  signupUser,
  eraseGlobalUser,
  clearUser,
} from "../../src/redux/reducers/userReducer";
import { clearWeeks } from "../../src/redux/reducers/weekReducer";
import { clearMyAliments } from "../../src/redux/reducers/myAlimentReducer";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Solo necesitamos mockear los servicios que userReducer realmente importa
import signupService from "../../src/services/signup.js";
import loginService from "../../src/services/login.js";

// Mockeamos signup y login devolviendo las funciones que se usan
vi.mock("../../src/services/signup", () => ({
  default: {
    signup: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
  },
}));

vi.mock("../../src/services/login", () => ({
  default: {
    login: vi.fn(),
  },
}));

describe("userReducer", () => {
  describe("Async Thunks (Lógica de Registro, Login y Logout)", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      window.localStorage.clear();
    });

    it("signupUser debe registrar al usuario Y hacer login automático", async () => {
      const userInfo = {
        email: "nuevo@test.com",
        password: "Pass123",
        username: "nuevo",
        name: "Nuevo Usuario",
      };

      // Simulamos respuesta exitosa del registro
      signupService.signup.mockResolvedValue({ ...userInfo });

      const loginResponse = {
        token: "fake-jwt-token",
        username: "nuevo",
        name: "Nuevo Usuario",
      };

      // Simulamos respuesta exitosa del login
      loginService.login.mockResolvedValue(loginResponse);

      const dispatch = vi.fn(async (action) => {
        if (typeof action === "function") {
          await action(dispatch);
        }
      });

      await signupUser(userInfo)(dispatch);

      expect(signupService.signup).toHaveBeenCalledWith(userInfo);
      // userReducer llama a saveGlobalUser internamente, que llama a loginService
      expect(loginService.login).toHaveBeenCalledWith({
        email: userInfo.email,
        password: userInfo.password,
      });
      // Finalmente debe setear el usuario en el estado
      expect(dispatch).toHaveBeenCalledWith(setUser(loginResponse));
    });

    it("debe manejar errores si el registro falla", async () => {
      const userInfo = { email: "error@test.com", password: "123" };
      const error = new Error("El usuario ya existe");

      signupService.signup.mockRejectedValue(error);

      const dispatch = vi.fn(async (action) => {
        if (typeof action === "function") {
          await action(dispatch);
        }
      });

      await signupUser(userInfo)(dispatch);

      // Si falla el registro, NO debe intentar loguearse
      expect(loginService.login).not.toHaveBeenCalled();
      // Debe haber intentado despachar algo (probablemente la notificación de error)
      expect(dispatch).toHaveBeenCalled();
    });

    // --- TEST CORREGIDO DE LOGOUT ---
    it("eraseGlobalUser debe cerrar sesión, limpiar localStorage y limpiar estado de Redux", () => {
      // 1. Setup: Ponemos un token sucio
      window.localStorage.setItem("token", "token-a-borrar");
      const dispatch = vi.fn();

      // 2. Ejecutar acción
      eraseGlobalUser()(dispatch);

      // 3. Verificaciones
      // A) LocalStorage: Debe estar limpio
      expect(window.localStorage.getItem("token")).toBeNull();

      expect(dispatch).toHaveBeenCalledWith(clearUser());
      expect(dispatch).toHaveBeenCalledWith(clearWeeks());
      expect(dispatch).toHaveBeenCalledWith(clearMyAliments());
    });
  });
});
