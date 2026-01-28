import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import MyAlimentForm from "../../src/components/MyAlimentForm/MyAlimentForm";

// 1. MOCKEAR EL HOOK PERSONALIZADO
// Le decimos a Vitest: "Cuando el componente pida 'useMyAliments', dale esto en su lugar".
// Usamos vi.fn() para poder espiar si la función 'create' fue llamada después.
const mockCreate = vi.fn();

vi.mock("../../src/hooks/useMyAliments", () => ({
  default: () => ({
    create: mockCreate,
  }),
}));

// 2. MOCKEAR EL COMPONENTE HIJO
// MyAlimentList usa Redux. Si no lo mockeamos, el test fallaría pidiendo un <Provider>.
// Simplemente hacemos que renderice un div vacío o texto simple.
vi.mock("../../src/components/MyAlimentForm/MyAlimentList", () => ({
  default: () => <div data-testid="mock-list">Lista Mockeada</div>,
}));

describe("MyAlimentForm Component", () => {
  // Limpiamos los mocks antes de cada test para que no se acumulen llamadas
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar todos los inputs correctamente", () => {
    render(<MyAlimentForm />);

    // Verificamos que existen los inputs buscando por su placeholder
    // (Es buena práctica usar getByLabelText, pero como tu code usa placeholders, usamos eso)
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Kcal \/ 100g/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  it("debe llamar a la función 'create' con los datos correctos al enviar", async () => {
    const user = userEvent.setup();
    render(<MyAlimentForm />);

    // 1. Simular escritura del usuario
    // Escribimos el nombre
    const nameInput = screen.getByPlaceholderText("Name");
    await user.type(nameInput, "Manzana");

    // Escribimos las calorías (Kcal)
    const kcalInput = screen.getByPlaceholderText("Kcal / 100g");
    await user.type(kcalInput, "52");

    // Escribimos la proteína
    const proteinInput = screen.getByPlaceholderText("Grams of protein");
    await user.type(proteinInput, "0.3");

    // 2. Simular click en el botón
    const submitBtn = screen.getByRole("button", { name: /Create/i });
    await user.click(submitBtn);

    // 3. ASERCIONES (Lo que esperamos que pase)

    // Verificamos que la función create del hook se llamó 1 vez
    expect(mockCreate).toHaveBeenCalledTimes(1);

    // Verificamos que se llamó con el objeto transformado correctamente
    // Tu componente convierte los strings a Number, así que probamos eso también logicamente
    expect(mockCreate).toHaveBeenCalledWith({
      name: "Manzana",
      nutritionFacts: {
        kcal100G: 52, // String "52" -> Number 52
        proteinG: 0.3, // String "0.3" -> Number 0.3
        // El resto deberían ser 0 porque no escribimos nada y tu lógica pone 0 por defecto
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

    const nameInput = screen.getByPlaceholderText("Name");
    await user.type(nameInput, "Pera");

    const submitBtn = screen.getByRole("button", { name: /Create/i });
    await user.click(submitBtn);

    // Verificamos que el valor del input vuelve a estar vacío
    expect(nameInput).toHaveValue("");
  });

  it("debe transformar strings vacíos a 0 automáticamente", async () => {
    const user = userEvent.setup();
    render(<MyAlimentForm />);

    const nameInput = screen.getByPlaceholderText("Name");
    await user.type(nameInput, "Agua");

    // No escribimos nada en los campos numéricos (se quedan vacíos)

    const submitBtn = screen.getByRole("button", { name: /Create/i });
    await user.click(submitBtn);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Agua",
        nutritionFacts: expect.objectContaining({
          kcal100G: 0, // Verificamos la lógica del ternario: value === "" ? 0
          fatG: 0,
        }),
      }),
    );
  });
});
