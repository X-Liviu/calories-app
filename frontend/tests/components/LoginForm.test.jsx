import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LoginForm from "../../src/components/LoginForm";
import useAuth from "../../src/hooks/useAuth";

// 1. Mock del hook (Ruta corregida a src)
vi.mock("../../src/hooks/useAuth", () => ({
  default: vi.fn(),
}));

// NOTA: He quitado el mock de Toggable. Vamos a usar el real e interactuar con él.
// He quitado el mock de ErrorMessage, no suele ser necesario mockear componentes tan simples.

describe("<LoginForm />", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin,
    });
  });

  // FUNCIÓN HELPER: Como el form está oculto, creamos una función para abrirlo
  const openForm = async (user) => {
    const showButton = screen.getByRole("button", { name: /Log In/i });
    await user.click(showButton);
  };

  it("renderiza correctamente los inputs y el botón", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Primero abrimos el formulario
    await openForm(user);

    expect(screen.getByPlaceholderText("E-Mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /confirm/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("mantiene el botón deshabilitado si el email es inválido", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await openForm(user); // Abrimos form

    const emailInput = screen.getByPlaceholderText("E-Mail");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    await user.type(passwordInput, "Password123");
    await user.type(emailInput, "email-invalido");

    expect(submitButton).toBeDisabled();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("habilita el botón y permite login con credenciales válidas", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await openForm(user); // Abrimos form

    const emailInput = screen.getByPlaceholderText("E-Mail");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Password123",
    });
  });
});
