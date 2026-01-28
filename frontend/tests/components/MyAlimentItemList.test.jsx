import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MyAlimentItemList from "../../src/components/MyAlimentForm/MyAlimentItemList";

// 1. Mockeamos los hooks
const mockUpdate = vi.fn();
const mockDel = vi.fn();

vi.mock("../../src/hooks/useMyAliments", () => ({
  default: () => ({
    update: mockUpdate,
    del: mockDel,
  }),
}));

// Datos de prueba
const mockAliment = {
  id: "123",
  name: "Pollo",
  nutritionFacts: {
    kcal100G: 100,
    fatG: 5,
    saturatedFatG: 1,
    carbsG: 0,
    sugarG: 0,
    fiberG: 0,
    proteinG: 20,
    saltG: 1,
  },
};

const renderComponent = () => {
  render(
    <table>
      <tbody>
        <MyAlimentItemList myAliment={mockAliment} />
      </tbody>
    </table>,
  );
};

describe("MyAlimentItemList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe mostrar los valores iniciales correctamente", () => {
    renderComponent();
    expect(screen.getByText("Pollo")).toBeInTheDocument();

    // Al ser input type="number", JSDOM devuelve el valor como número
    expect(screen.getByDisplayValue(100)).toBeInTheDocument();
    expect(screen.getByDisplayValue(20)).toBeInTheDocument();
  });

  it("debe renderizar inputs con type='number' (Solución 1)", () => {
    renderComponent();
    const kcalInput = screen.getByDisplayValue(100);
    // Verificamos que añadiste type="number" en tu JSX
    expect(kcalInput).toHaveAttribute("type", "number");
  });

  it("debe llamar a 'update' al presionar ENTER", async () => {
    const user = userEvent.setup();
    renderComponent();

    const kcalInput = screen.getByDisplayValue(100);

    // 1. Usuario hace click y borra
    await user.click(kcalInput);
    await user.clear(kcalInput);

    // 2. Usuario escribe
    await user.type(kcalInput, "150");

    fireEvent.submit(kcalInput.closest("form"));

    // 3. Esperamos a que la actualización ocurra
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      id: "123",
      kcal100G: 150,
    });
  });

  it("NO debe guardar y debe resetear el valor al hacer click fuera (Blur)", async () => {
    const user = userEvent.setup();
    renderComponent();

    const kcalInput = screen.getByDisplayValue(100);

    await user.click(kcalInput);
    await user.clear(kcalInput);
    await user.type(kcalInput, "999");

    // Click fuera (en el body)
    await user.click(document.body);

    expect(mockUpdate).not.toHaveBeenCalled();

    // El valor visual vuelve a ser 100 (número)
    expect(kcalInput).toHaveValue(100);
  });

  it("no debe permitir escribir letras (bloqueado por type='number')", async () => {
    const user = userEvent.setup();
    renderComponent();

    const proteinInput = screen.getByDisplayValue(20);
    await user.click(proteinInput);

    // Intentamos escribir "abc"
    await user.type(proteinInput, "abc");

    // El valor sigue siendo 20 (número), las letras se ignoraron
    expect(proteinInput).toHaveValue(20);
  });

  it("debe manejar correctamente números decimales", async () => {
    const user = userEvent.setup();
    renderComponent();

    const fatInput = screen.getByDisplayValue(5);

    await user.click(fatInput);
    await user.clear(fatInput);

    // Usamos paste para evitar problemas de configuración regional con el punto decimal
    await user.paste("5.5");

    // Forzamos el submit de nuevo por la limitación de JSDOM
    fireEvent.submit(fatInput.closest("form"));

    // SOLUCIÓN: Envolvemos el expect en waitFor
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        id: "123",
        fatG: 5.5,
      });
    });
  });

  it("debe llamar a 'del' al borrar", async () => {
    const user = userEvent.setup();
    renderComponent();

    const deleteBtn = screen.getByText("❌");
    await user.click(deleteBtn);

    expect(mockDel).toHaveBeenCalledTimes(1);
    expect(mockDel).toHaveBeenCalledWith({ id: "123" });
  });

  it("debe gestionar el estado visual readOnly correctamente", async () => {
    const user = userEvent.setup();
    renderComponent();

    const kcalInput = screen.getByDisplayValue(100);

    // Inicio: Solo lectura
    expect(kcalInput).toHaveAttribute("readonly");

    // Focus: Editable
    await user.click(kcalInput);
    expect(kcalInput).not.toHaveAttribute("readonly");

    // Blur: Solo lectura otra vez
    await user.click(document.body);
    expect(kcalInput).toHaveAttribute("readonly");
  });
});
