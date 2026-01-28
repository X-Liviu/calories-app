import {
  setUser,
  signupUser,
  eraseGlobalUser, // <--- Importamos la acción de logout
  clearUser,
} from "../../src/redux/reducers/userReducer";
import { clearWeeks } from "../../src/redux/reducers/weekReducer";
import { clearMyAliments } from "../../src/redux/reducers/myAlimentReducer";
import { vi, describe, it, expect, beforeEach } from "vitest";

// IMPORTAMOS TODOS LOS SERVICIOS PARA MOCKEARLOS
import signupService from "../../src/services/signup.js";
import loginService from "../../src/services/login.js";
import weekService from "../../src/services/weeks.js";
import myAlimentService from "../../src/services/myAliments.js";
import dayService from "../../src/services/days.js";
import mealService from "../../src/services/meals.js";
import alimentService from "../../src/services/aliments.js";

// MOCKEAMOS TODOS LOS SERVICIOS
// Esto es necesario porque eraseGlobalUser llama a .setToken(null) en todos ellos
vi.mock("../../src/services/signup");
vi.mock("../../src/services/login");
vi.mock("../../src/services/weeks");
vi.mock("../../src/services/myAliments");
vi.mock("../../src/services/days");
vi.mock("../../src/services/meals");
vi.mock("../../src/services/aliments");

describe("userReducer", () => {
  describe("Async Thunks (Lógica de Registro, Login y Logout)", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Limpiamos localStorage antes de cada test para asegurar aislamiento
      window.localStorage.clear();
    });

    it("signupUser debe registrar al usuario Y hacer login automático", async () => {
      const userInfo = {
        email: "nuevo@test.com",
        password: "Pass123",
        username: "nuevo",
        name: "Nuevo Usuario",
      };

      signupService.signup.mockResolvedValue({ ...userInfo });

      const loginResponse = {
        token: "fake-jwt-token",
        username: "nuevo",
        name: "Nuevo Usuario",
      };
      loginService.login.mockResolvedValue(loginResponse);

      const dispatch = vi.fn(async (action) => {
        if (typeof action === "function") {
          await action(dispatch);
        }
      });

      await signupUser(userInfo)(dispatch);

      expect(signupService.signup).toHaveBeenCalledWith(userInfo);
      expect(loginService.login).toHaveBeenCalledWith({
        email: userInfo.email,
        password: userInfo.password,
      });
      expect(dispatch).toHaveBeenCalledWith(setUser(loginResponse));
    });

    it("debe manejar errores si el registro falla", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const userInfo = { email: "error@test.com", password: "123" };
      const error = new Error("El usuario ya existe");
      signupService.signup.mockRejectedValue(error);

      const dispatch = vi.fn(async (action) => {
        if (typeof action === "function") {
          await action(dispatch);
        }
      });

      await signupUser(userInfo)(dispatch);

      expect(loginService.login).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    // --- NUEVO TEST: LOGOUT ---
    it("eraseGlobalUser debe cerrar sesión, limpiar localStorage, estado y servicios", () => {
      // 1. Preparamos el escenario: Guardamos un token "sucio"
      window.localStorage.setItem("token", "token-que-debe-ser-borrado");

      // Verificamos que existe antes de empezar (sanity check)
      expect(window.localStorage.getItem("token")).toBe(
        "token-que-debe-ser-borrado",
      );

      const dispatch = vi.fn();

      // 2. Ejecutamos el Thunk
      eraseGlobalUser()(dispatch);

      // 3. Verificaciones

      // A) LocalStorage: CORRECCIÓN -> Verificamos que el token YA NO EXISTE (es null)
      expect(window.localStorage.getItem("token")).toBeNull();

      // B) Redux: Se deben despachar las acciones de limpieza
      expect(dispatch).toHaveBeenCalledWith(clearUser());
      expect(dispatch).toHaveBeenCalledWith(clearWeeks());
      expect(dispatch).toHaveBeenCalledWith(clearMyAliments());

      // C) Servicios: Se debe poner el token a null en TODOS
      expect(signupService.setToken).toHaveBeenCalledWith(null);
      expect(weekService.setToken).toHaveBeenCalledWith(null);
      expect(myAlimentService.setToken).toHaveBeenCalledWith(null);
      expect(dayService.setToken).toHaveBeenCalledWith(null);
      expect(mealService.setToken).toHaveBeenCalledWith(null);
      expect(alimentService.setToken).toHaveBeenCalledWith(null);
    });
  });
});
