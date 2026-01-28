import { render, screen, waitFor } from "@testing-library/react";
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
// Identificadores extraídos de los fixtures para configurar la ruta
const TARGET_WEEK_ID = mockWeekWithCalories.id;
const TARGET_DAY_ID = mockDayWithFood.id;

// --- RENDER HELPER ---
const renderWithProviders = (
  ui,
  {
    preloadedState = mockLoadedState, // Usamos el estado que ya tiene la semana con calorías
    store = configureStore({
      reducer: {
        weeks: weekReducer,
        year: yearReducer,
      },
      preloadedState,
    }),
    // IMPORTANTE: Simulamos que estamos en la URL del día específico
    route = `/weeks/${TARGET_WEEK_ID}/${TARGET_DAY_ID}`,
  } = {},
) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            {/* Definimos la ruta con los parámetros que espera DayItem */}
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

  it("debe renderizar el nombre del día y las comidas existentes", () => {
    renderWithProviders(<DayItem />);

    // Verifica el título del día
    expect(screen.getByText(mockDayWithFood.name)).toBeInTheDocument();

    // Verifica que las comidas del fixture se renderizan
    expect(screen.getByText(mockMeal1.name)).toBeInTheDocument(); // Almuerzo
    expect(screen.getByText(mockMeal2.name)).toBeInTheDocument(); // Cena
  });

  it("debe mostrar correctamente el total de calorías de cada comida", () => {
    renderWithProviders(<DayItem />);

    // mockMeal1 (Almuerzo) tiene 200 kcal
    // mockMeal2 (Cena) tiene 350 kcal
    // El formato en MealItemList es: "Nombre (X kcal)"

    // Buscamos algo que contenga "200 kcal"
    expect(screen.getByText(/200 kcal/)).toBeInTheDocument();

    // Buscamos algo que contenga "350 kcal"
    expect(screen.getByText(/350 kcal/)).toBeInTheDocument();
  });

  it("debe validar el formulario de creación (botón deshabilitado si está vacío)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DayItem />);

    const input = screen.getByPlaceholderText("Name of the meal");
    const submitButton = screen.getByText("Create Meal");

    // Inicialmente deshabilitado
    expect(submitButton).toBeDisabled();

    // Escribimos espacios en blanco (inválido según validateNoEmpty)
    await user.type(input, "   ");
    expect(submitButton).toBeDisabled();

    // Limpiamos y escribimos algo válido
    await user.clear(input);
    await user.type(input, "Merienda");
    expect(submitButton).not.toBeDisabled();
  });

  it("debe crear una nueva comida correctamente y actualizar la lista", async () => {
    const user = userEvent.setup();
    const newMealName = "Merienda";

    // PREPARACIÓN DEL MOCK DE RETORNO
    // weekReducer espera que el servicio devuelva la SEMANA ACTUALIZADA
    const updatedWeek = {
      ...mockWeekWithCalories,
      days: mockWeekWithCalories.days.map((d) => {
        if (d.id === TARGET_DAY_ID) {
          return {
            ...d,
            meals: [
              ...d.meals,
              { id: "meal-new", name: newMealName, aliments: [] },
            ],
          };
        }
        return d;
      }),
    };
    mealService.create.mockResolvedValue(updatedWeek);

    renderWithProviders(<DayItem />);

    // Interacción con el formulario
    const input = screen.getByPlaceholderText("Name of the meal");
    await user.type(input, newMealName);

    const submitButton = screen.getByText("Create Meal");
    await user.click(submitButton);

    // Verificación de llamada al servicio
    expect(mealService.create).toHaveBeenCalledWith({
      name: newMealName,
      dayId: TARGET_DAY_ID,
      weekId: TARGET_WEEK_ID,
    });

    // Verificación de actualización visual
    await waitFor(() => {
      expect(screen.getByText(newMealName)).toBeInTheDocument();
    });

    // Verificación de limpieza del input
    expect(input).toHaveValue("");
  });

  it("debe borrar una comida correctamente tras confirmar en el modal", async () => {
    const user = userEvent.setup();

    // Para borrar, basta con que el servicio resuelva (el reducer actualiza el estado localmente)
    mealService.del.mockResolvedValue({});

    renderWithProviders(<DayItem />);

    // 1. Click en borrar la primera comida (Almuerzo)
    // Usamos getAllByText("❌") porque hay varios botones de borrar
    const deleteButtons = screen.getAllByText("❌");
    await user.click(deleteButtons[0]);

    // 2. Confirmar en el modal
    expect(screen.getByText("Delete Meal")).toBeInTheDocument();
    const confirmBtn = screen.getByText("Yes, I confirm.");
    await user.click(confirmBtn);

    // 3. Verificar eliminación visual
    // Esperamos que "Almuerzo" desaparezca
    await waitFor(() => {
      expect(screen.queryByText(mockMeal1.name)).not.toBeInTheDocument();
    });

    // Verificamos llamada al servicio con los IDs correctos
    expect(mealService.del).toHaveBeenCalledWith({
      weekId: TARGET_WEEK_ID,
      dayId: TARGET_DAY_ID,
      mealId: mockMeal1.id,
    });
  });

  it("debe cerrar el modal sin borrar si el usuario cancela", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DayItem />);

    // 1. Abrir modal
    const deleteButtons = screen.getAllByText("❌");
    await user.click(deleteButtons[0]);

    // 2. Cancelar
    const cancelBtn = screen.getByText("Cancel");
    await user.click(cancelBtn);

    // 3. Verificar
    // El modal desaparece
    expect(screen.queryByText("Delete Meal")).not.toBeInTheDocument();
    // La comida sigue ahí
    expect(screen.getByText(mockMeal1.name)).toBeInTheDocument();
    // No se llamó al servicio
    expect(mealService.del).not.toHaveBeenCalled();
  });
});
