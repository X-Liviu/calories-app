import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Reducers y Servicios
import weekReducer from "../../src/redux/reducers/weekReducer";
import yearReducer from "../../src/redux/reducers/yearReducer";
import myAlimentReducer from "../../src/redux/reducers/myAlimentReducer";
import alimentService from "../../src/services/aliments";
import mealService from "../../src/services/meals";

// Componente
import MealItem from "../../src/components/MealItem/MealItem";

// Fixtures
import {
  mockLoadedState,
  mockWeekWithCalories,
  mockDayWithFood,
  mockMeal1,
  mockAliment1,
  mockCatalogAliment,
} from "../textFixtures";

// --- MOCKS ---
vi.mock("../../src/services/aliments");
vi.mock("../../src/services/meals");

// Identificadores para la ruta
const WEEK_ID = mockWeekWithCalories.id;
const DAY_ID = mockDayWithFood.id;
const MEAL_ID = mockMeal1.id;

// --- RENDER HELPER ---
const renderWithProviders = (
  ui,
  {
    preloadedState = mockLoadedState,
    store = configureStore({
      reducer: {
        weeks: weekReducer,
        year: yearReducer,
        myAliments: myAlimentReducer,
      },
      preloadedState,
    }),
    route = `/weeks/${WEEK_ID}/${DAY_ID}/${MEAL_ID}`,
  } = {},
) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/weeks/:weekId/:dayId/:mealId" element={ui} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    ),
    store,
  };
};

describe("MealItem - Aliments Management (Integration)", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el nombre de la comida y los alimentos existentes", () => {
    renderWithProviders(<MealItem />);

    // Título de la comida
    expect(screen.getByText(mockMeal1.name)).toBeInTheDocument(); // Almuerzo

    // Alimento existente (Arroz)
    expect(screen.getByText("Arroz")).toBeInTheDocument();

    // Verificamos las calorías. Al quitar toLocaleString, es "200 kcal"
    expect(screen.getByText(/200 kcal/)).toBeInTheDocument();
  });

  it("debe añadir un 'Custom Aliment' (sin catálogo) correctamente", async () => {
    const user = userEvent.setup();
    const newAliment = { name: "Manzana", grams: "150", kcal: "80" };

    // Mock response
    alimentService.create.mockResolvedValue({ ...mockWeekWithCalories });

    renderWithProviders(<MealItem />);

    // ACTUALIZACIÓN: Nuevos placeholders del AlimentForm
    const nameInput = screen.getByPlaceholderText("Aliment Name");
    const gramsInput = screen.getByPlaceholderText("Grams (Optional)");
    const kcalInput = screen.getByPlaceholderText("Total Kcal");
    const submitBtn = screen.getByRole("button", {
      name: /add custom aliment/i,
    });

    // Llenamos el formulario
    await user.type(nameInput, newAliment.name);
    await user.type(gramsInput, newAliment.grams);
    await user.type(kcalInput, newAliment.kcal);

    // Enviamos
    expect(submitBtn).toBeEnabled();
    await user.click(submitBtn);

    // Verificamos llamada al servicio
    expect(alimentService.create).toHaveBeenCalledWith({
      name: newAliment.name,
      grams: 150,
      customKcal: Number(newAliment.kcal), // El componente lo convierte a Number
      weekId: WEEK_ID,
      dayId: DAY_ID,
      mealId: MEAL_ID,
    });

    // Verificamos limpieza de inputs
    expect(nameInput).toHaveValue("");
  });

  it("debe añadir un alimento desde el Catálogo (Select)", async () => {
    const user = userEvent.setup();
    const grams = "100";

    alimentService.create.mockResolvedValue({ ...mockWeekWithCalories });

    renderWithProviders(<MealItem />);

    // 1. Buscamos el Select y el Input de gramos del catálogo
    // El select se puede buscar por role combobox
    const select = screen.getByRole("combobox");

    // ACTUALIZACIÓN: Nuevo placeholder en AlimentCatalogSelectorForm
    const gramsInput = screen.getByPlaceholderText("Grams eaten (e.g. 100)");

    // ACTUALIZACIÓN: Nuevo texto del botón
    const addBtn = screen.getByRole("button", { name: /add from catalog/i });

    // 2. Seleccionamos "Aguacate" (del fixture mockCatalogAliment)
    await user.selectOptions(select, mockCatalogAliment.name);

    // 3. Escribimos gramos
    await user.type(gramsInput, grams);

    // 4. Enviamos (CORREGIDO: Usamos waitFor para esperar a que el estado se actualice)
    await waitFor(() => {
      expect(addBtn).toBeEnabled();
    });

    await user.click(addBtn);

    // 5. Verificamos llamada
    expect(alimentService.create).toHaveBeenCalledWith({
      name: mockCatalogAliment.name,
      grams: 100, // Se convierte a Number
      weekId: WEEK_ID,
      dayId: DAY_ID,
      mealId: MEAL_ID,
      userAliment: mockCatalogAliment.id,
    });
  });

  it("debe borrar un alimento directamente (SIN modal de confirmación)", async () => {
    const user = userEvent.setup();
    alimentService.del.mockResolvedValue({});

    renderWithProviders(<MealItem />);

    // ACTUALIZACIÓN: Buscamos por title="Delete Aliment" ya que el icono es visual
    const deleteButtons = screen.getAllByTitle("Delete Aliment");
    // Borramos el primer alimento (Arroz)
    await user.click(deleteButtons[0]);

    // En tu componente AlimentItemList NO hay modal, llama directo a 'del'
    expect(alimentService.del).toHaveBeenCalledWith({
      weekId: WEEK_ID,
      dayId: DAY_ID,
      mealId: MEAL_ID,
      mealAlimentId: mockAliment1.id,
    });
  });

  it("debe actualizar el estado de 'Cheat Meal' al hacer click en el checkbox", async () => {
    const user = userEvent.setup();
    mealService.update.mockResolvedValue({});

    renderWithProviders(<MealItem />);

    // Buscamos el checkbox (está dentro de un label .switch-label)
    const checkbox = screen.getByRole("checkbox");

    // Estado inicial (según mockMeal1 false)
    expect(checkbox).not.toBeChecked();

    // Click para marcar
    await user.click(checkbox);

    // Verificar llamada
    expect(mealService.update).toHaveBeenCalledWith({
      weekId: WEEK_ID,
      dayId: DAY_ID,
      mealId: MEAL_ID,
      cheat: true, // Se envía el nuevo valor
    });
  });
});
