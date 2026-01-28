import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";

import SignUpForm from "../../src/components/SignUpForm";
import useAuth from "../../src/hooks/useAuth";

// 1. Mock del hook
vi.mock("../../src/hooks/useAuth", () => ({
  default: vi.fn(),
}));

describe("<SignUpForm />", () => {
  const mockSignup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      signup: mockSignup,
    });
  });

  // Helper para abrir el formulario (Ya que usas el componente real Toggable)
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
    expect(submitButton).toBeDisabled();
  });

  it("muestra errores de validación (email/nombre) y mantiene el botón deshabilitado", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await openForm(user);

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("E-Mail");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    // Caso: Email inválido
    await user.type(nameInput, "User Test");
    await user.type(emailInput, "email-malo");

    // Aquí sí esperamos mensaje porque tu componente SÍ tiene ErrorMessage para email
    expect(await screen.findByText(/E-Mail not valid/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  // CAMBIO IMPORTANTE AQUÍ:
  it("mantiene el botón deshabilitado cuando las contraseñas no coinciden", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await openForm(user);

    const nameInput = screen.getByPlaceholderText("Name");
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("E-Mail");
    const passwordInput = screen.getByPlaceholderText("Password");
    const repeatInput = screen.getByPlaceholderText("Repeat Password");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    // Llenamos el resto de campos válidos para aislar el error de la contraseña
    await user.type(nameInput, "Valid Name");
    await user.type(usernameInput, "validuser");
    await user.type(emailInput, "valid@email.com");

    // Escribimos contraseñas que NO coinciden
    await user.type(passwordInput, "Pass123!");
    await user.type(repeatInput, "Pass1234"); // Diferente

    // ASERCIÓN: No buscamos texto de error, solo verificamos que NO deja enviar
    expect(submitButton).toBeDisabled();
  });

  it("habilita el botón y llama a signup con los datos correctos", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await openForm(user);

    const nameInput = screen.getByPlaceholderText("Name");
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("E-Mail");
    const passwordInput = screen.getByPlaceholderText("Password");
    const repeatInput = screen.getByPlaceholderText("Repeat Password");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    // Llenamos el formulario ("Happy Path")
    await user.type(nameInput, "John Doe");
    await user.type(usernameInput, "johndoe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "Password123!");
    await user.type(repeatInput, "Password123!"); // Coinciden

    // Esperamos validación
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    expect(mockSignup).toHaveBeenCalledTimes(1);
    expect(mockSignup).toHaveBeenCalledWith({
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "Password123!",
    });
  });

  it("muestra visualmente las reglas de contraseña", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await openForm(user);

    const passwordInput = screen.getByPlaceholderText("Password");
    await user.type(passwordInput, "test");

    const lengthRule = screen.getByText("At least 8 characters");
    expect(lengthRule).toBeInTheDocument();
  });
});
