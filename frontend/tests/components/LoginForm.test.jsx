import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LoginForm from "../../src/components/LoginForm";
import useAuth from "../../src/hooks/useAuth";

import { mockUser } from "../textFixtures";

vi.mock("../../src/hooks/useAuth", () => ({
  default: vi.fn(),
}));

describe("<LoginForm />", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin,
    });
  });

  const openForm = async (user) => {
    const showButton = screen.getByRole("button", { name: /Log In/i });
    await user.click(showButton);
  };

  it("renderiza correctamente los inputs y el botón", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await openForm(user);

    expect(screen.getByPlaceholderText("E-Mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /confirm/i });
    expect(submitButton).toBeInTheDocument();

    expect(submitButton).toHaveClass("btn-disabled");
  });

  it("mantiene el botón visualmente desactivado y NO envía si el email es inválido", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await openForm(user);

    const emailInput = screen.getByPlaceholderText("E-Mail");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    await user.type(passwordInput, "Password123");
    await user.type(emailInput, "email-invalido");

    expect(submitButton).toHaveClass("btn-disabled");

    await user.click(submitButton);

    expect(mockLogin).not.toHaveBeenCalled();

    expect(screen.getByText(/E-Mail not valid/i)).toBeInTheDocument();
  });

  it("habilita el botón y permite login con credenciales válidas", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await openForm(user);

    const emailInput = screen.getByPlaceholderText("E-Mail");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    await user.type(emailInput, mockUser.email);
    await user.type(passwordInput, "Password123");

    await waitFor(() => {
      expect(submitButton).not.toHaveClass("btn-disabled");
    });

    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({
      email: mockUser.email,
      password: "Password123",
    });
  });
});
