import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Reducers y Servicios
import weekReducer from "../../src/redux/reducers/weekReducer";
import yearReducer from "../../src/redux/reducers/yearReducer";
import mealService from "../../src/services/meals";

// Componente a testear
import DayItem from "../../src/components/DayItem/DayItem";

// Fixtures
import {
  mockLoadedState,
  mockWeekWithCalories,
  mockDayWithFood,
  mockMeal1,
  mockMeal2,
} from "../textFixtures";

// --- MOCKS ---
vi.mock("../../src/services/meals");

// --- UTILS LOCALES ---
const TARGET_WEEK_ID = mockWeekWithCalories.id;
const TARGET_DAY_ID = mockDayWithFood.id;

// --- RENDER HELPER ---
const renderWithProviders = (
  ui,
  {
    preloadedState = mockLoadedState,
    store = configureStore({
      reducer: {
        weeks: weekReducer,
        year: yearReducer,
      },
      preloadedState,
    }),
    route = `/weeks/${TARGET_WEEK_ID}/${TARGET_DAY_ID}`,
  } = {},
) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/weeks/:weekId/:dayId" element={ui} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    ),
    store,
  };
};

describe("DayItem - Meals Management (Integration)", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // 1. RENDERIZADO BÁSICO
  it("debe renderizar el nombre del día y las comidas existentes", () => {
    renderWithProviders(<DayItem />);

    // Header del día
    expect(screen.getByText(mockDayWithFood.name)).toBeInTheDocument();

    // Comidas renderizadas (MealList -> MealItemList)
    // mockMeal1 es "Almuerzo", mockMeal2 es "Cena"
    expect(screen.getByText(mockMeal1.name)).toBeInTheDocument();
    expect(screen.getByText(mockMeal2.name)).toBeInTheDocument();
  });

  // 2. CALORÍAS (RECUPERADO)
  it("debe mostrar correctamente el total de calorías de cada comida", () => {
    renderWithProviders(<DayItem />);

    // mockMeal1 tiene mockAliment1 (200 kcal)
    // mockMeal2 tiene mockAliment2 (350 kcal)

    // Buscamos "200 kcal" y "350 kcal"
    // Nota: Como hemos quitado toLocaleString(), el formato es simple.
    expect(screen.getByText("200 kcal")).toBeInTheDocument();
    expect(screen.getByText("350 kcal")).toBeInTheDocument();
  });

  // 3. VALIDACIÓN (RECUPERADO)
  it("debe validar el formulario de creación (botón deshabilitado si está vacío)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DayItem />);

    const input = screen.getByPlaceholderText(
      "Name of the meal (e.g. Breakfast)",
    );
    const submitBtn = screen.getByRole("button", { name: /add meal/i });

    // Inicialmente deshabilitado
    expect(submitBtn).toBeDisabled();

    // Escribir solo espacios
    await user.type(input, "   ");
    expect(submitBtn).toBeDisabled();

    // Borrar
    await user.clear(input);
    expect(submitBtn).toBeDisabled();
  });

  // 4. CREACIÓN EXITOSA
  it("debe crear una nueva comida correctamente y actualizar la lista", async () => {
    const user = userEvent.setup();
    const newMealName = "Merienda";

    // Simulamos respuesta del servicio
    mealService.create.mockResolvedValue({
      id: "meal-new",
      name: newMealName,
      aliments: [],
      dayId: TARGET_DAY_ID,
      weekId: TARGET_WEEK_ID,
    });

    renderWithProviders(<DayItem />);

    const input = screen.getByPlaceholderText(
      "Name of the meal (e.g. Breakfast)",
    );
    const submitBtn = screen.getByRole("button", { name: /add meal/i });

    // Escribir nombre válido
    await user.type(input, newMealName);
    expect(submitBtn).toBeEnabled();

    // Enviar
    await user.click(submitBtn);

    // Verificar llamada
    expect(mealService.create).toHaveBeenCalledWith({
      name: newMealName,
      dayId: TARGET_DAY_ID,
      weekId: TARGET_WEEK_ID,
    });

    // El input debe limpiarse
    expect(input).toHaveValue("");
  });

  // 5. BORRADO EXITOSO
  it("debe borrar una comida correctamente tras confirmar en el modal", async () => {
    const user = userEvent.setup();
    mealService.del.mockResolvedValue({});

    renderWithProviders(<DayItem />);

    // 1. Abrir modal de borrado (usamos el título del botón/icono)
    const deleteButtons = screen.getAllByTitle("Delete meal");
    await user.click(deleteButtons[0]); // Borramos la primera comida

    // 2. Confirmar en el modal
    expect(screen.getByText("Delete Meal")).toBeInTheDocument();

    // Botón actualizado: "Yes, Delete"
    const confirmBtn = screen.getByRole("button", { name: "Yes, Delete" });
    await user.click(confirmBtn);

    // 3. Verificar llamada
    expect(mealService.del).toHaveBeenCalledWith({
      weekId: TARGET_WEEK_ID,
      dayId: TARGET_DAY_ID,
      mealId: mockMeal1.id,
    });
  });

  // 6. CANCELAR BORRADO
  it("debe cerrar el modal sin borrar si el usuario cancela", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DayItem />);

    // 1. Abrir modal
    const deleteButtons = screen.getAllByTitle("Delete meal");
    await user.click(deleteButtons[0]);

    // 2. Cancelar
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    // 3. Verificar que el modal se cierra y no se borró nada
    expect(screen.queryByText("Delete Meal")).not.toBeInTheDocument();
    expect(screen.getByText(mockMeal1.name)).toBeInTheDocument();
    expect(mealService.del).not.toHaveBeenCalled();
  });
});
