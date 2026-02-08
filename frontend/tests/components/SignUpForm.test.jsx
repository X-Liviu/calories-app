import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";

import SignUpForm from "../../src/components/SignUpForm";
import useAuth from "../../src/hooks/useAuth";

import { mockUser } from "../textFixtures";

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
    expect(submitButton).toHaveClass("btn-disabled");
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

    const validPassword = "Password123!";

    await user.type(nameInput, mockUser.name);
    await user.type(usernameInput, mockUser.username);
    await user.type(emailInput, mockUser.email);
    await user.type(passwordInput, validPassword);
    await user.type(repeatInput, validPassword);

    await waitFor(() => {
      expect(submitButton).not.toHaveClass("btn-disabled");
    });

    await user.click(submitButton);

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

    await user.type(passwordInput, "test");

    const lengthRule = screen.getByText(/At least 8 characters/i);
    expect(lengthRule).toBeVisible();
  });

  it("muestra error y NO envía si las contraseñas no coinciden", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await openForm(user);

    const passwordInput = screen.getByPlaceholderText("Password");
    const repeatInput = screen.getByPlaceholderText("Repeat Password");
    const submitButton = screen.getByRole("button", { name: /confirm/i });

    await user.type(passwordInput, "Password123!");
    await user.type(repeatInput, "Password1234!");

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    expect(submitButton).toHaveClass("btn-disabled");

    await user.click(submitButton);
    expect(mockSignup).not.toHaveBeenCalled();
  });
});
