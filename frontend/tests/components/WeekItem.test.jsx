import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import weekReducer from "../../src/redux/reducers/weekReducer.js";
import yearReducer from "../../src/redux/reducers/yearReducer.js";
import dayService from "../../src/services/days.js";
import WeekItem from "../../src/components/WeekItem/WeekItem";

// IMPORTAMOS LOS FIXTURES
import {
  mockWeek1,
  mockLoadedState,
  mockDayEmpty,
  mockDayWithFood,
} from "../textFixtures.js";

// --- MOCKS ---
vi.mock("../../src/services/days");

// --- UTILS LOCALES ---
const getStateWithDays = (customDay = mockDayEmpty) => {
  return {
    ...mockLoadedState,
    weeks: {
      ...mockLoadedState.weeks,
      data: mockLoadedState.weeks.data.map((w) =>
        w.id === mockWeek1.id ? { ...w, days: [customDay] } : w,
      ),
    },
  };
};

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
    route = `/weeks/${mockWeek1.id}`,
  } = {},
) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/weeks/:weekId" element={ui} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    ),
    store,
  };
};

describe("WeekItem - Days Management (Integration)", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar la semana y los días existentes", () => {
    renderWithProviders(<WeekItem />, { preloadedState: getStateWithDays() });

    expect(
      screen.getByText(`Week ${mockWeek1.numberWeek}`),
    ).toBeInTheDocument();
    expect(screen.getByText(mockDayEmpty.name)).toBeInTheDocument();
  });

  it("debe mostrar correctamente el total de calorías si el día tiene comidas", () => {
    renderWithProviders(<WeekItem />, {
      preloadedState: getStateWithDays(mockDayWithFood),
    });

    // Verificamos la suma (550 kcal)
    // El formato nuevo es "550 kcal" (sin paréntesis fuertes alrededor del número en DayItemList)
    expect(screen.getByText(/550 kcal/)).toBeInTheDocument();
    expect(screen.getByText(mockDayWithFood.name)).toBeInTheDocument();
  });

  it("debe validar el formulario de creación (botón deshabilitado si está vacío)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WeekItem />, { preloadedState: mockLoadedState });

    // ACTUALIZACIÓN: Nuevo placeholder
    const input = screen.getByPlaceholderText("Name of the day (e.g. Monday)");
    // ACTUALIZACIÓN: Nuevo texto de botón
    const submitButton = screen.getByRole("button", { name: /add day/i });

    expect(submitButton).toBeDisabled();

    await user.type(input, "123"); // Validación de solo letras
    expect(submitButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, "Martes");
    expect(submitButton).not.toBeDisabled();
  });

  it("debe crear un nuevo día correctamente y actualizar la lista", async () => {
    const user = userEvent.setup();
    const newDayName = "Miércoles";

    const updatedWeekFixture = {
      ...mockWeek1,
      days: [
        { id: "day-new", name: newDayName, meals: [], weekId: mockWeek1.id },
      ],
    };
    dayService.create.mockResolvedValue(updatedWeekFixture);

    renderWithProviders(<WeekItem />, { preloadedState: mockLoadedState });

    const input = screen.getByPlaceholderText("Name of the day (e.g. Monday)");
    await user.type(input, newDayName);

    // 1. Clic en "Add Day"
    const submitButton = screen.getByRole("button", { name: /add day/i });
    await user.click(submitButton);

    // 2. Verificar Modal (Botón actualizado a "Yes, Create")
    const confirmButton = screen.getByRole("button", { name: "Yes, Create" });
    await user.click(confirmButton);

    // 3. Verificar llamada al servicio
    expect(dayService.create).toHaveBeenCalledWith({
      name: newDayName,
      weekId: mockWeek1.id,
    });

    await waitFor(() => {
      expect(screen.getByText(newDayName)).toBeInTheDocument();
    });

    expect(input).toHaveValue("");
  });

  it("debe borrar un día correctamente tras confirmar en el modal", async () => {
    const user = userEvent.setup();
    dayService.del.mockResolvedValue({});

    renderWithProviders(<WeekItem />, {
      preloadedState: getStateWithDays(mockDayEmpty),
    });

    expect(screen.getByText(mockDayEmpty.name)).toBeInTheDocument();

    // ACTUALIZACIÓN: Buscamos por título o clase, ya no por texto "❌" genérico
    const deleteBtn = screen.getByTitle("Delete day");
    await user.click(deleteBtn);

    expect(screen.getByText("Delete Day")).toBeInTheDocument();

    // ACTUALIZACIÓN: Texto del botón de confirmación en DayList
    const confirmBtn = screen.getByRole("button", { name: "Yes, Delete" });
    await user.click(confirmBtn);

    // Esperamos que desaparezca (aunque aquí solo mockeamos la llamada,
    // en integración real redux actualizaría el estado)
    expect(dayService.del).toHaveBeenCalledWith({
      weekId: mockWeek1.id,
      dayId: mockDayEmpty.id,
    });
  });

  it("debe cerrar el modal sin borrar si el usuario cancela", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WeekItem />, {
      preloadedState: getStateWithDays(mockDayEmpty),
    });

    await user.click(screen.getByTitle("Delete day"));

    // Botón cancelar estándar
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(screen.queryByText("Delete Day")).not.toBeInTheDocument();
    expect(screen.getByText(mockDayEmpty.name)).toBeInTheDocument();
    expect(dayService.del).not.toHaveBeenCalled();
  });

  it("debe impedir la creación de nuevos días si la semana ya tiene 7 días (Límite alcanzado)", () => {
    // 1. Crear un array ficticio con 7 días
    const fullWeekDays = Array.from({ length: 7 }, (_, i) => ({
      id: `day-${i}`,
      name: `Day ${i}`,
      meals: [],
      weekId: mockWeek1.id,
    }));

    // 2. Estado saturado
    const stateWithFullWeek = {
      ...mockLoadedState,
      weeks: {
        ...mockLoadedState.weeks,
        data: mockLoadedState.weeks.data.map((w) =>
          w.id === mockWeek1.id ? { ...w, days: fullWeekDays } : w,
        ),
      },
    };

    renderWithProviders(<WeekItem />, {
      preloadedState: stateWithFullWeek,
    });

    // 4. Verificaciones de UX (Interfaz Bloqueada)

    // Input con placeholder especial
    const input = screen.getByPlaceholderText("Week is full (7/7)");
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();

    // Botón con texto "Full"
    const submitButton = screen.getByText("Full");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Mensaje de advertencia (actualizado con el texto exacto de DayForm)
    expect(screen.getByText(/Maximum of 7 days reached/i)).toBeInTheDocument();
  });
});
