import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";

import SignUpForm from "../../src/components/SignUpForm";
import useAuth from "../../src/hooks/useAuth";

// Importamos el fixture
import { mockUser } from "../textFixtures";

// 1. Mock del hook
vi.mock("../../src/hooks/useAuth", () => ({
  default: vi.fn(),
}));

describe("<SignUpForm /> Integration", () => {
  const mockSignup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      signup: mockSignup,
    });
  });

  // Helper para abrir el formulario
  const openForm = async (user) => {
    const showButton = screen.getByRole("button", { name: /Sign Up/i });
    await user.click(showButton);
  };

  it("renderiza todos los campos del formulario correctamente", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await openForm(user);

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("E-Mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repeat Password")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /confirm/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("permite rellenar el formulario y llamar a signup con datos válidos (Happy Path)", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await openForm(user);

    const nameInput = screen.getByPlaceholderText("Name");
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("E-Mail");
    const passwordInput = screen.getByPlaceholderText("Password");
    const repeatInput = screen.getByPlaceholderText("Repeat Password");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    // Contraseña válida para pasar las reglas del validador (Upper, Lower, Number, Symbol, min 8)
    const validPassword = "Password123!";

    // Llenamos el formulario usando los datos del MOCK
    await user.type(nameInput, mockUser.name);
    await user.type(usernameInput, mockUser.username);
    await user.type(emailInput, mockUser.email);

    // Escribimos la contraseña
    await user.type(passwordInput, validPassword);
    await user.type(repeatInput, validPassword); // Coinciden

    // Esperamos que el botón se habilite tras la validación
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    // Verificamos que se llame con los datos correctos
    expect(mockSignup).toHaveBeenCalledTimes(1);
    expect(mockSignup).toHaveBeenCalledWith({
      name: mockUser.name,
      username: mockUser.username,
      email: mockUser.email,
      password: validPassword,
    });
  });

  it("muestra visualmente las reglas de contraseña", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await openForm(user);

    const passwordInput = screen.getByPlaceholderText("Password");

    // Escribimos algo incompleto
    await user.type(passwordInput, "test");

    // "At least 8 characters" debería estar visible (la lista se muestra al escribir)
    const lengthRule = screen.getByText(/At least 8 characters/i);
    expect(lengthRule).toBeVisible();
    // Al ser inválido, debería tener clase de error (aunque en test unitario es difícil ver el color,
    // podemos confiar en que el texto está ahí)
  });

  it("muestra error si las contraseñas no coinciden", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await openForm(user);

    const passwordInput = screen.getByPlaceholderText("Password");
    const repeatInput = screen.getByPlaceholderText("Repeat Password");

    await user.type(passwordInput, "Password123!");
    await user.type(repeatInput, "Password1234!"); // Diferente

    // Debe aparecer el mensaje de error
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    // El botón debe seguir deshabilitado
    const submitButton = screen.getByRole("button", { name: /confirm/i });
    expect(submitButton).toBeDisabled();
  });
});
