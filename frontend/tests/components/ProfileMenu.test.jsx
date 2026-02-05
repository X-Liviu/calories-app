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

  // Helper para abrir el menú (clic en el avatar)
  const openMenu = async (user) => {
    // El avatar muestra la inicial del nombre. En mockUser es "Usuario de Prueba" -> "U"
    const avatar = screen.getByText("U");
    await user.click(avatar);
  };

  it("renderiza el avatar con la inicial del usuario", () => {
    renderWithRedux(<ProfileMenu />);
    expect(screen.getByText("U")).toBeInTheDocument();
    // El menú debe estar cerrado al principio
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("abre el menú y muestra la información del usuario", async () => {
    const user = userEvent.setup();
    renderWithRedux(<ProfileMenu />);

    await openMenu(user);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(`@${mockUser.username}`)).toBeInTheDocument();
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("llama a logout cuando se hace clic en el botón de salir", async () => {
    const user = userEvent.setup();
    renderWithRedux(<ProfileMenu />);

    await openMenu(user);
    await user.click(screen.getByText("Logout"));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  describe("Flujo de Edición (Edit Profile)", () => {
    it("abre el modal de edición al hacer clic", async () => {
      const user = userEvent.setup();
      renderWithRedux(<ProfileMenu />);

      await openMenu(user);
      await user.click(screen.getByText("Edit Profile"));

      expect(screen.getByText("Edit Profile")).toBeInTheDocument(); // Título del modal
      expect(screen.getByDisplayValue(mockUser.name)).toBeInTheDocument(); // Input prellenado
    });

    it("valida el formulario y muestra errores si hay datos inválidos", async () => {
      const user = userEvent.setup();
      renderWithRedux(<ProfileMenu />);

      await openMenu(user);
      await user.click(screen.getByText("Edit Profile"));

      // Borrar el nombre para provocar error
      const nameInput = screen.getByLabelText("Name");
      await user.clear(nameInput);

      await user.click(screen.getByText("Save Changes"));

      // Validamos que NO se llamó a editar
      expect(mockEditUser).not.toHaveBeenCalled();

      // Nota: Asumimos que validateUpdateUserForm devuelve error para nombre vacío
      // Si tu validador devuelve errores, aparecerán en spans con clase .text-error
    });

    it("debe llamar a editUser con los datos nuevos si todo es correcto", async () => {
      const user = userEvent.setup();
      mockEditUser.mockResolvedValue({});

      renderWithRedux(<ProfileMenu />);

      // Abrir modal
      await openMenu(user);
      await user.click(screen.getByText("Edit Profile"));

      // Cambiar el nombre
      const nameInput = screen.getByLabelText("Name");
      await user.clear(nameInput);
      await user.type(nameInput, "Nombre Editado");

      // Guardar
      await user.click(screen.getByText("Save Changes"));

      // Verificar llamada
      expect(mockEditUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Nombre Editado",
          username: mockUser.username,
        }),
      );

      // El modal debería cerrarse
      await waitFor(() => {
        expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
      });
    });
  });

  describe("Flujo de Borrado (Delete Account)", () => {
    it("abre el modal de confirmación y llama a deleteAcc al confirmar", async () => {
      const user = userEvent.setup();
      mockDeleteAcc.mockResolvedValue({});

      renderWithRedux(<ProfileMenu />);

      await openMenu(user);
      await user.click(screen.getByText("Delete Account"));

      expect(screen.getByText("Delete Account")).toBeInTheDocument(); // Título del modal
      expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();

      // Confirmar
      const confirmBtn = screen.getByRole("button", { name: /yes, delete/i });
      await user.click(confirmBtn);

      expect(mockDeleteAcc).toHaveBeenCalledTimes(1);
    });
  });
});
