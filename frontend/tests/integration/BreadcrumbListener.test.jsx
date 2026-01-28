import { render } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// Componente a testear
import BreadcrumbListener from "../../src/components/BreadcrumbListener";

// Reducers y Selectores
import * as itemActions from "../../src/redux/reducers/itemLinkReducer";
import * as weekSelectors from "../../src/redux/selectors/weekSelectors";

// Fixtures
import {
  mockWeekWithCalories,
  mockDayWithFood,
  mockMeal1,
} from "../textFixtures";

// --- MOCKS ---
vi.mock("../../src/redux/reducers/itemLinkReducer", () => ({
  setItem: vi.fn(),
  resetItems: vi.fn(),
}));

vi.mock("../../src/redux/selectors/weekSelectors", () => ({
  selectWeeks: vi.fn(),
}));

// --- RENDER HELPER ---
const renderListener = (route) => {
  const store = configureStore({
    reducer: {
      dummy: (state = {}) => state,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <BreadcrumbListener />
      </MemoryRouter>
    </Provider>,
  );
};

describe("BreadcrumbListener Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    weekSelectors.selectWeeks.mockReturnValue([mockWeekWithCalories]);
    itemActions.resetItems.mockReturnValue({ type: "RESET" });
    itemActions.setItem.mockReturnValue({ type: "SET_ITEM" });
  });

  it("debe resetear los items al estar en la Home ('/')", () => {
    renderListener("/");
    expect(itemActions.resetItems).toHaveBeenCalled();
  });

  it("debe añadir 'Catalog' al navegar a /my-aliments", () => {
    renderListener("/my-aliments");
    expect(itemActions.resetItems).toHaveBeenCalled();
    expect(itemActions.setItem).toHaveBeenCalledWith({
      name: "Catalog",
      URL: "/my-aliments",
    });
  });

  it("debe añadir 'Login' al navegar a /login", () => {
    renderListener("/login");
    expect(itemActions.setItem).toHaveBeenCalledWith({
      name: "Login",
      URL: "/login",
    });
  });

  it("debe añadir 'Week X' al navegar al detalle de una semana", () => {
    renderListener(`/weeks/${mockWeekWithCalories.id}`);
    expect(itemActions.resetItems).toHaveBeenCalled();
    expect(itemActions.setItem).toHaveBeenCalledWith({
      name: "Week 12",
      URL: `/weeks/${mockWeekWithCalories.id}`,
    });
  });

  it("debe añadir Week -> Day al navegar al detalle de un día", () => {
    renderListener(`/weeks/${mockWeekWithCalories.id}/${mockDayWithFood.id}`);
    expect(itemActions.setItem).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Week 12" }),
    );
    expect(itemActions.setItem).toHaveBeenCalledWith({
      name: mockDayWithFood.name,
      URL: `/weeks/${mockWeekWithCalories.id}/${mockDayWithFood.id}`,
    });
  });

  it("debe añadir Week -> Day -> Meal al navegar al detalle de una comida", () => {
    renderListener(
      `/weeks/${mockWeekWithCalories.id}/${mockDayWithFood.id}/${mockMeal1.id}`,
    );
    expect(itemActions.setItem).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Week 12" }),
    );
    expect(itemActions.setItem).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Martes" }),
    );
    expect(itemActions.setItem).toHaveBeenCalledWith({
      name: mockMeal1.name,
      URL: `/weeks/${mockWeekWithCalories.id}/${mockDayWithFood.id}/${mockMeal1.id}`,
    });
  });

  // --- CORRECCIÓN EN ESTE TEST ---
  it("no debe añadir nada si el ID de la semana no existe", () => {
    renderListener("/weeks/id-inexistente");

    // Al no encontrar la semana, el componente hace un 'return' temprano.
    // Por tanto, NO se llama a resetItems ni a setItem.
    expect(itemActions.resetItems).not.toHaveBeenCalled();
    expect(itemActions.setItem).not.toHaveBeenCalled();
  });
});
