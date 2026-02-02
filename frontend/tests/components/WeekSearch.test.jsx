import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";

// Componentes
import WeekSearch from "../../src/components/WeekSearch/WeekSearch.jsx";
// Importamos WeekForm directamente para testearlo unitariamente si fuera necesario,
// aunque en este test de integración se renderiza dentro de WeekSearch (salvo cuando estaba mockeado).
// NOTA: Para integrar ambos tests, VAMOS A QUITAR EL MOCK DE WeekForm que tenías antes,
// para que el test de integración pruebe el componente REAL y podamos testear la creación también.

// Reducers reales
import userReducer from "../../src/redux/reducers/userReducer.js";
import weekReducer from "../../src/redux/reducers/weekReducer.js";
import yearReducer from "../../src/redux/reducers/yearReducer.js";
import myAlimentReducer from "../../src/redux/reducers/myAlimentReducer.js";

// Fixtures
import { mockLoadedState } from "../textFixtures.js";

// --- MOCKS ---

// Mockeamos useYearManager
const mockChangeYear = vi.fn();
vi.mock("../../src/hooks/useYearManager", () => ({
  default: () => ({
    changeYear: mockChangeYear,
  }),
}));

// Mockeamos useWeeks completo (create y del)
const mockDel = vi.fn();
const mockCreate = vi.fn(); // Nuevo mock para create
vi.mock("../../src/hooks/useWeeks", () => ({
  default: () => ({
    del: mockDel,
    create: mockCreate,
  }),
}));

// Mockeamos SkeletonWeeks para evitar animaciones
vi.mock("../../src/components/WeekSearch/SkeletonWeeks", () => ({
  default: () => <div data-testid="skeleton">Cargando...</div>,
}));

// --- HELPER RENDER ---
const renderWithRedux = (component, preloadedState = mockLoadedState) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      weeks: weekReducer,
      year: yearReducer,
      myAliments: myAlimentReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe("<WeekSearch /> Full Integration", () => {
  // Limpieza de mocks antes de cada test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Limpieza extra por si acaso
  afterEach(() => {
    vi.clearAllMocks();
  });

  // --- TESTS DE NAVEGACIÓN Y AÑO ---

  it("renderiza el selector de años con las opciones correctas basado en el usuario", () => {
    renderWithRedux(<WeekSearch />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("2023");
    expect(screen.getByRole("option", { name: "2023" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2020" })).toBeInTheDocument();
  });

  it("llama a changeYear cuando el usuario selecciona otro año", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "2021");
    expect(mockChangeYear).toHaveBeenCalledTimes(1);
    expect(mockChangeYear).toHaveBeenCalledWith(2021);
  });

  // --- TESTS DE LISTADO Y BÚSQUEDA ---

  it("renderiza la lista de semanas correctamente (WeekList)", () => {
    renderWithRedux(<WeekSearch />);
    expect(screen.getByText(/Week 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Week 11/i)).toBeInTheDocument();
  });

  it("filtra la lista de semanas cuando el usuario escribe en el input de búsqueda", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    // Buscamos el input de búsqueda. Como hay dos inputs (Search y Create),
    // necesitamos distinguirlos.
    // El input de búsqueda está dentro de un form que dice "Search your number of the week:"
    // Una forma robusta es buscar por el valor inicial (vacío) o por su posición,
    // pero dado tu componente, el de búsqueda es el SEGUNDO form o podemos buscar por placeholder si tuviera.
    // En tu código WeekSearch.jsx, el input de búsqueda NO tiene placeholder.
    // El input de creación tiene placeholder="Week (1 - 53)".

    // Estrategia: Obtener todos los textbox y filtrar el que NO tiene placeholder
    const inputs = screen.getAllByRole("textbox");
    const searchInput = inputs.find((input) => !input.placeholder);

    // Si no lo encuentras así, puedes añadir un placeholder o label en el código fuente.
    // Asumiremos que es el segundo textbox si el primero es el de creación (depende del orden de renderizado).
    // Viendo tu código: <WeekForm /> va ANTES que el input de búsqueda?
    // En WeekSearch.jsx:
    // 1. Select
    // 2. Form Search (INPUT SEARCH)
    // 3. WeekForm (INPUT CREATE)
    // Así que el searchInput debería ser el PRIMERO.

    // Verificamos inicial
    expect(screen.getByText(/Week 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Week 11/i)).toBeInTheDocument();

    await user.type(searchInput, "10");

    expect(screen.getByText(/Week 10/i)).toBeInTheDocument();
    expect(screen.queryByText(/Week 11/i)).not.toBeInTheDocument();
  });

  it("muestra mensaje de 'no encontrado' si el filtro no coincide con nada", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    // Identificamos el input de búsqueda (el que no tiene placeholder)
    const inputs = screen.getAllByRole("textbox");
    const searchInput = inputs.find((input) => !input.placeholder);

    await user.type(searchInput, "50");
    expect(screen.getByText(/Week 50/i)).toBeInTheDocument();
    expect(screen.getByText(/was not found/i)).toBeInTheDocument();
  });

  it("valida que el input de búsqueda solo acepte números y longitud máxima 2", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const inputs = screen.getAllByRole("textbox");
    const searchInput = inputs.find((input) => !input.placeholder);

    await user.type(searchInput, "abc");
    expect(searchInput).toHaveValue("");

    await user.type(searchInput, "123");
    expect(searchInput).toHaveValue("12");
  });

  // --- TESTS DE CREACIÓN (WeekForm) ---

  it("el botón 'Create' del formulario debe estar deshabilitado inicialmente", () => {
    renderWithRedux(<WeekSearch />);
    // El botón Create está dentro de WeekForm
    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).toBeDisabled();
  });

  it("el input de creación valida números entre 1 y 53", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const createInput = screen.getByPlaceholderText("Week (1 - 53)");
    const createButton = screen.getByRole("button", { name: /create/i });

    await user.type(createInput, "abc");
    expect(createInput).toHaveValue("");

    await user.type(createInput, "15");
    expect(createButton).not.toBeDisabled();
  });

  it("debe abrir el modal de CREACIÓN y llamar a create SOLO al confirmar", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const createInput = screen.getByPlaceholderText("Week (1 - 53)");
    await user.type(createInput, "25");

    // 1. Clic en Create
    const createBtn = screen.getByRole("button", { name: /create/i });
    await user.click(createBtn);

    // 2. Verificar que create NO se ha llamado todavía
    expect(mockCreate).not.toHaveBeenCalled();

    // 3. Verificar modal
    expect(screen.getByText("Add Week")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to add this week/i),
    ).toBeInTheDocument();

    // 4. Confirmar
    const confirmBtn = screen.getByRole("button", { name: "Yes, I confirm." });
    await user.click(confirmBtn);

    // 5. Verificar llamada
    expect(mockCreate).toHaveBeenCalledTimes(1);
    // El año viene del estado global (mockLoadedState tiene 2023)
    expect(mockCreate).toHaveBeenCalledWith({
      numberWeek: 25,
      year: 2023,
    });

    // 6. Verificar limpieza
    await waitFor(() => {
      expect(createInput).toHaveValue("");
      expect(screen.queryByText("Add Week")).not.toBeInTheDocument();
    });
  });

  it("debe cancelar la CREACIÓN si se cierra el modal", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const createInput = screen.getByPlaceholderText("Week (1 - 53)");
    await user.type(createInput, "30");

    await user.click(screen.getByRole("button", { name: /create/i }));

    // Cancelar
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);

    expect(mockCreate).not.toHaveBeenCalled();
    expect(screen.queryByText("Add Week")).not.toBeInTheDocument();
    // El input mantiene valor
    expect(createInput).toHaveValue("30");
  });

  // --- TESTS DE BORRADO (WeekList) ---

  it("debe abrir el modal de confirmación y borrar la semana SOLO al confirmar", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const deleteButtons = screen.getAllByText("❌");
    await user.click(deleteButtons[0]);

    expect(screen.getByText("Delete Week")).toBeInTheDocument();
    expect(mockDel).not.toHaveBeenCalled();

    const confirmBtn = screen.getByRole("button", { name: /Yes, I confirm/i });
    await user.click(confirmBtn);

    expect(mockDel).toHaveBeenCalledTimes(1);
    expect(mockDel).toHaveBeenCalledWith({ id: "week-1" });
  });

  it("debe cerrar el modal y NO borrar si se pulsa Cancelar", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const deleteButtons = screen.getAllByText("❌");
    await user.click(deleteButtons[0]);

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelBtn);

    expect(screen.queryByText("Delete Week")).not.toBeInTheDocument();
    expect(mockDel).not.toHaveBeenCalled();
  });

  // --- TEST DE CALORÍAS ---

  it("debe mostrar correctamente el recuento total de calorías de la semana", () => {
    renderWithRedux(<WeekSearch />);
    // Semana 12 en fixture tiene 550 kcal
    expect(screen.getByText(/Week 12/i)).toBeInTheDocument();
    expect(screen.getByText(/550 kcal/i)).toBeInTheDocument();
  });
});
