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

// IMPORTAMOS LOS NUEVOS FIXTURES
import {
  mockWeek1,
  mockLoadedState,
  mockDayEmpty,
  mockDayWithFood,
} from "../textFixtures.js";

// --- MOCKS ---
vi.mock("../../src/services/days");

// --- UTILS LOCALES ---
// Helper simplificado usando los fixtures
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
    // Usamos el helper que por defecto usa mockDayEmpty ("Lunes")
    renderWithProviders(<WeekItem />, { preloadedState: getStateWithDays() });

    expect(
      screen.getByText(`Week ${mockWeek1.numberWeek}`),
    ).toBeInTheDocument();
    expect(screen.getByText(mockDayEmpty.name)).toBeInTheDocument();
  });

  it("debe mostrar correctamente el total de calorías si el día tiene comidas", () => {
    // AQUÍ ESTÁ LA MAGIA: Pasamos el fixture 'mockDayWithFood'
    // Este día ya tiene configuradas las comidas y alimentos dentro de textFixtures.js
    renderWithProviders(<WeekItem />, {
      preloadedState: getStateWithDays(mockDayWithFood),
    });

    // Verificamos la suma (200 + 350 = 550)
    // Buscamos "Martes (550 kcal)"
    expect(screen.getByText(/550 kcal/)).toBeInTheDocument();
    expect(screen.getByText(mockDayWithFood.name)).toBeInTheDocument();
  });

  it("debe validar el formulario de creación (botón deshabilitado si está vacío)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WeekItem />, { preloadedState: mockLoadedState });

    const input = screen.getByPlaceholderText("Name of the day");
    const submitButton = screen.getByText("Create Day");

    expect(submitButton).toBeDisabled();

    await user.type(input, "123");
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

    const input = screen.getByPlaceholderText("Name of the day");
    await user.type(input, newDayName);

    // 1. Clic en el botón del formulario (Abre el Modal)
    const submitButton = screen.getByText("Create Day");
    await user.click(submitButton);

    // 2. Verificamos que aparece el modal (buscando el botón de confirmar)
    // Nota: Asegúrate de que el texto coincida exactamente con la prop 'confirmText' en tu DayForm.
    // En tu código anterior era "Yes, I confirm." (con punto)
    const confirmButton = screen.getByText("Yes, I confirm.");

    // 3. Confirmamos la acción en el modal
    await user.click(confirmButton);

    // 4. Ahora sí verificamos que el servicio se llamó
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

    // Usamos el día vacío para borrar
    renderWithProviders(<WeekItem />, {
      preloadedState: getStateWithDays(mockDayEmpty),
    });

    expect(screen.getByText(mockDayEmpty.name)).toBeInTheDocument();

    const deleteBtn = screen.getByText("❌");
    await user.click(deleteBtn);

    expect(screen.getByText("Delete Day")).toBeInTheDocument();

    const confirmBtn = screen.getByText("Yes, I confirm.");
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByText(mockDayEmpty.name)).not.toBeInTheDocument();
    });

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

    await user.click(screen.getByText("❌"));

    const cancelBtn = screen.getByText("Cancel");
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

    // 2. Construir manualmente un estado donde la semana objetivo tiene esos 7 días
    const stateWithFullWeek = {
      ...mockLoadedState,
      weeks: {
        ...mockLoadedState.weeks,
        data: mockLoadedState.weeks.data.map((w) =>
          w.id === mockWeek1.id ? { ...w, days: fullWeekDays } : w,
        ),
      },
    };

    // 3. Renderizar el componente con ese estado saturado
    renderWithProviders(<WeekItem />, {
      preloadedState: stateWithFullWeek,
    });

    // 4. Verificaciones de UX (Interfaz Bloqueada)

    // El input debe tener el placeholder especial y estar deshabilitado
    const input = screen.getByPlaceholderText("Week is full (7/7)");
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();

    // El botón debe cambiar de texto y estar deshabilitado
    const submitButton = screen.getByText("Full Week");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Verificar que aparece el mensaje de advertencia (si lo añadiste en el paso anterior)
    expect(screen.getByText("Maximum of 7 days reached.")).toBeInTheDocument();
  });
});
