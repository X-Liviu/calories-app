import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Componentes
import ProfileMenu from "../../src/components/ProfileMenu/ProfileMenu";

// Reducers y Servicios
import userReducer from "../../src/redux/reducers/userReducer";

// Fixtures
import { mockUser } from "../textFixtures";

// 1. MOCKEAMOS EL HOOK useAuth
// Esto es vital: así controlamos qué pasa cuando el componente pide "logout" o "editUser"
const mockLogout = vi.fn();
const mockDeleteAcc = vi.fn();
const mockEditUser = vi.fn();

vi.mock("../../src/hooks/useAuth", () => ({
  default: () => ({
    logout: mockLogout,
    deleteAcc: mockDeleteAcc,
    editUser: mockEditUser,
  }),
}));

// --- RENDER HELPER ---
const renderWithRedux = (
  ui,
  {
    preloadedState = { user: mockUser }, // Cargamos el usuario del fixture
    store = configureStore({
      reducer: { user: userReducer },
      preloadedState,
    }),
  } = {},
) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};

describe("ProfileMenu Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el avatar con la inicial del usuario", () => {
    renderWithRedux(<ProfileMenu />);

    // El usuario mockUser se llama "Usuario de Prueba", inicial "U"
    expect(screen.getByText("U")).toBeInTheDocument();
    // El avatar tiene un title con el username
    expect(screen.getByTitle(mockUser.username)).toBeInTheDocument();
  });

  it("debe abrir y cerrar el menú al hacer click en el avatar", async () => {
    const user = userEvent.setup();
    renderWithRedux(<ProfileMenu />);

    // 1. Inicialmente el menú NO está visible
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();

    // 2. Click en el avatar -> Abre menú
    const avatar = screen.getByText("U");
    await user.click(avatar);

    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();

    // 3. Click en el backdrop (fondo) -> Cierra menú
    // Nota: Tu componente tiene un div backdrop transparente.
    // Simulamos click fuera haciendo click en el body o buscando el backdrop si tiene role.
    // Como tu backdrop no tiene role, hacemos click en el avatar de nuevo para cerrar (toggle)
    await user.click(avatar);

    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("debe llamar a 'logout' al hacer click en el botón correspondiente", async () => {
    const user = userEvent.setup();
    renderWithRedux(<ProfileMenu />);

    // Abrir menú
    await user.click(screen.getByText("U"));

    // Click Logout
    const logoutBtn = screen.getByText("Logout");
    await user.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);

    // El menú debe cerrarse tras la acción
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  describe("Delete Account Flow", () => {
    it("debe abrir el modal de confirmación y llamar a deleteAcc solo si se confirma", async () => {
      const user = userEvent.setup();
      renderWithRedux(<ProfileMenu />);

      // 1. Abrir menú y click en Delete Account
      await user.click(screen.getByText("U"));
      await user.click(screen.getByText("Delete Account"));

      // 2. Verificar que se abre el modal (buscamos por el texto del título)
      // En ProfileMenu pasas title="¿Are you sure?"
      expect(screen.getByText("¿Are you sure?")).toBeInTheDocument();
      expect(mockDeleteAcc).not.toHaveBeenCalled();

      // 3. Confirmar borrado
      // El modal usa "Yes, delete my account." como texto de confirmación
      const confirmBtn = screen.getByText("Yes, delete my account.");
      await user.click(confirmBtn);

      expect(mockDeleteAcc).toHaveBeenCalledTimes(1);
    });

    it("NO debe borrar la cuenta si se cancela en el modal", async () => {
      const user = userEvent.setup();
      renderWithRedux(<ProfileMenu />);

      await user.click(screen.getByText("U"));
      await user.click(screen.getByText("Delete Account"));

      const cancelBtn = screen.getByText("Cancel");
      await user.click(cancelBtn);

      expect(screen.queryByText("¿Are you sure?")).not.toBeInTheDocument();
      expect(mockDeleteAcc).not.toHaveBeenCalled();
    });
  });

  describe("Edit Profile Flow (Modal)", () => {
    it("debe abrir el modal y rellenar los datos actuales del usuario", async () => {
      const user = userEvent.setup();
      renderWithRedux(<ProfileMenu />);

      // Abrir menú y click Editar
      await user.click(screen.getByText("U"));
      await user.click(screen.getByText("Edit Profile"));

      // Verificar que el modal está abierto y los inputs tienen valor
      expect(screen.getByDisplayValue(mockUser.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockUser.username)).toBeInTheDocument();
    });

    it("debe validar que las contraseñas coincidan antes de enviar", async () => {
      const user = userEvent.setup();
      renderWithRedux(<ProfileMenu />);

      // Abrir modal
      await user.click(screen.getByText("U"));
      await user.click(screen.getByText("Edit Profile"));

      // Rellenar contraseñas diferentes
      const newPassInput = screen.getByLabelText("New Password:"); // Buscamos por Label
      const repeatPassInput = screen.getByLabelText("Repeat New Password:");

      await user.type(newPassInput, "NewPass123");
      await user.type(repeatPassInput, "Distinta123");

      // Click guardar
      const saveBtn = screen.getByText("Save Changes");
      await user.click(saveBtn);

      // NO debe llamar a editar
      expect(mockEditUser).not.toHaveBeenCalled();

      // Debe mostrar error (tu validación suele usar window.alert o mostrar texto rojo)
      // Viendo EditProfileModal.jsx, usas un span con style color red para errores.
      // Buscamos el mensaje de error que devuelve validateUpdateUserForm
      // (Asumiendo que devuelve "Passwords do not match" o similar)
      // Como no tengo el archivo de validaciones, verifico que el mock NO se llamó.
      expect(mockEditUser).toHaveBeenCalledTimes(0);
    });

    it("debe llamar a editUser con los datos nuevos si todo es correcto", async () => {
      const user = userEvent.setup();
      // Simulamos que el hook resuelve bien
      mockEditUser.mockResolvedValue({});

      renderWithRedux(<ProfileMenu />);

      // Abrir modal
      await user.click(screen.getByText("U"));
      await user.click(screen.getByText("Edit Profile"));

      // Cambiar el nombre
      const nameInput = screen.getByDisplayValue(mockUser.name);
      await user.clear(nameInput);
      await user.type(nameInput, "Nombre Editado");

      // Guardar
      await user.click(screen.getByText("Save Changes"));

      // Verificar llamada
      expect(mockEditUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Nombre Editado",
          username: mockUser.username,
          // currentPassword: "", // Depende de si lo escribiste o no
        }),
      );

      // El modal debería cerrarse (waitFor porque es async)
      await waitFor(() => {
        expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
      });
    });
  });
});
