import { render, screen } from "@testing-library/react";
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
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  it("debe renderizar inputs con type='text' e inputMode='decimal'", () => {
    renderComponent();
    const kcalInput = screen.getByDisplayValue("100");
    expect(kcalInput).toHaveAttribute("type", "text");
    expect(kcalInput).toHaveAttribute("inputMode", "decimal");
  });

  it("debe llamar a 'update' al presionar ENTER", async () => {
    const user = userEvent.setup();
    renderComponent();

    const kcalInput = screen.getByDisplayValue("100");

    // 1. Activar y editar
    await user.click(kcalInput);
    await user.clear(kcalInput);
    await user.type(kcalInput, "150");

    // 2. Pulsar Enter para enviar el formulario
    await user.keyboard("{Enter}");

    // 3. Verificar llamada a update
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      id: "123",
      kcal100G: 150,
    });
  });

  it("mantiene el valor editado al hacer blur pero NO guarda en BD", async () => {
    const user = userEvent.setup();
    renderComponent();

    const kcalInput = screen.getByDisplayValue("100");

    // 1. Editar valor
    await user.click(kcalInput);
    await user.clear(kcalInput);
    await user.type(kcalInput, "250");

    // 2. Hacer click fuera (body) para disparar onBlur
    await user.click(document.body);

    // 3. Verificar que NO se llamó a update (solo se llama con Enter)
    expect(mockUpdate).not.toHaveBeenCalled();

    // 4. El valor visual se mantiene actualizado en el estado local
    expect(kcalInput).toHaveValue("250");
  });

  it("no debe permitir escribir letras", async () => {
    const user = userEvent.setup();
    renderComponent();

    const proteinInput = screen.getByDisplayValue("20");
    await user.click(proteinInput);

    // Intentamos escribir letras
    await user.type(proteinInput, "abc");

    // El valor no debe cambiar
    expect(proteinInput).toHaveValue("20");
  });

  it("debe manejar correctamente números decimales al guardar", async () => {
    const user = userEvent.setup();
    renderComponent();

    const fatInput = screen.getByDisplayValue("5");

    await user.click(fatInput);
    await user.clear(fatInput);
    await user.type(fatInput, "5.5");

    // Enviamos con Enter
    await user.keyboard("{Enter}");

    expect(mockUpdate).toHaveBeenCalledWith({
      id: "123",
      fatG: 5.5,
    });
  });

  it("debe llamar a 'del' al borrar", async () => {
    const user = userEvent.setup();
    renderComponent();

    const deleteBtn = screen.getByTitle("Delete Item");
    await user.click(deleteBtn);

    expect(mockDel).toHaveBeenCalledTimes(1);
    expect(mockDel).toHaveBeenCalledWith({ id: "123" });
  });

  it("debe gestionar el estado visual readOnly correctamente", async () => {
    const user = userEvent.setup();
    renderComponent();

    const kcalInput = screen.getByDisplayValue("100");

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
