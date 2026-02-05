import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MyAlimentForm from "../../src/components/MyAlimentForm/MyAlimentForm";

// 1. MOCKEAR EL HOOK PERSONALIZADO
const mockCreate = vi.fn();

vi.mock("../../src/hooks/useMyAliments", () => ({
  default: () => ({
    create: mockCreate,
  }),
}));

// 2. MOCKEAR EL COMPONENTE HIJO
vi.mock("../../src/components/MyAlimentForm/MyAlimentList", () => ({
  default: () => <div data-testid="mock-list">Lista Mockeada</div>,
}));

describe("MyAlimentForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar todos los inputs correctamente usando sus etiquetas", () => {
    render(<MyAlimentForm />);

    // Ahora buscamos por el texto del LABEL, que es más accesible y robusto
    expect(screen.getByLabelText("Product Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Kcal / 100g")).toBeInTheDocument();
    expect(screen.getByLabelText("Fat (g)")).toBeInTheDocument();

    // Verificamos el botón con el nuevo texto
    expect(
      screen.getByRole("button", { name: /Add to Catalog/i }),
    ).toBeInTheDocument();
  });

  it("debe llamar a la función 'create' con los datos correctos al enviar", async () => {
    const user = userEvent.setup();
    render(<MyAlimentForm />);

    // 1. Simular escritura
    // Buscamos inputs por su label asociado
    const nameInput = screen.getByLabelText("Product Name");
    await user.type(nameInput, "Manzana");

    const kcalInput = screen.getByLabelText("Kcal / 100g");
    await user.type(kcalInput, "52");

    const proteinInput = screen.getByLabelText("Protein (g)");
    await user.type(proteinInput, "0.3");

    // 2. Click en enviar
    const submitBtn = screen.getByRole("button", { name: /Add to Catalog/i });
    await user.click(submitBtn);

    // 3. Verificaciones
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      name: "Manzana",
      nutritionFacts: {
        kcal100G: 52, // Se convierte a número
        proteinG: 0.3,
        // El resto 0 por defecto
        fatG: 0,
        saturatedFatG: 0,
        carbsG: 0,
        sugarG: 0,
        fiberG: 0,
        saltG: 0,
      },
    });
  });

  it("debe limpiar el formulario después de enviar", async () => {
    const user = userEvent.setup();
    render(<MyAlimentForm />);

    const nameInput = screen.getByLabelText("Product Name");
    await user.type(nameInput, "Pera");

    const submitBtn = screen.getByRole("button", { name: /Add to Catalog/i });
    await user.click(submitBtn);

    // Verificamos limpieza
    expect(nameInput).toHaveValue("");
  });

  it("debe transformar strings vacíos a 0 automáticamente", async () => {
    const user = userEvent.setup();
    render(<MyAlimentForm />);

    const nameInput = screen.getByLabelText("Product Name");
    await user.type(nameInput, "Agua");

    // No escribimos nada en los campos numéricos

    const submitBtn = screen.getByRole("button", { name: /Add to Catalog/i });
    await user.click(submitBtn);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Agua",
        nutritionFacts: expect.objectContaining({
          kcal100G: 0, // Lógica del ternario: "" -> 0
          fatG: 0,
        }),
      }),
    );
  });
});
