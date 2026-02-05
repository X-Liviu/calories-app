import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";

// Componentes
import WeekSearch from "../../src/components/WeekSearch/WeekSearch.jsx";

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
const mockCreate = vi.fn();
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    // ACTUALIZACIÓN: Ahora buscamos por el nuevo placeholder específico
    const searchInput = screen.getByPlaceholderText("Search week number...");

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

    const searchInput = screen.getByPlaceholderText("Search week number...");

    await user.type(searchInput, "50");
    expect(screen.queryByText(/Week 50/i)).not.toBeInTheDocument(); // Aseguramos que no se renderiza como tarjeta
    expect(screen.getByText(/was not found/i)).toBeInTheDocument();
  });

  it("valida que el input de búsqueda solo acepte números y longitud máxima 2", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const searchInput = screen.getByPlaceholderText("Search week number...");

    await user.type(searchInput, "abc");
    expect(searchInput).toHaveValue("");

    await user.type(searchInput, "123");
    expect(searchInput).toHaveValue("12");
  });

  // --- TESTS DE CREACIÓN (WeekForm) ---

  it("el botón 'Add' del formulario debe estar deshabilitado inicialmente", () => {
    renderWithRedux(<WeekSearch />);
    // El botón se llama "Add" en el componente actualizado
    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toBeDisabled();
  });

  it("el input de creación valida números entre 1 y 53", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    // ACTUALIZACIÓN: Nuevo placeholder en WeekForm
    const createInput = screen.getByPlaceholderText("New Week (1 - 53)");
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(createInput, "abc");
    expect(createInput).toHaveValue("");

    await user.type(createInput, "15");
    expect(addButton).not.toBeDisabled();
  });

  it("debe abrir el modal de CREACIÓN y llamar a create SOLO al confirmar", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const createInput = screen.getByPlaceholderText("New Week (1 - 53)");
    await user.type(createInput, "25");

    // 1. Clic en Add
    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    // 2. Verificar que create NO se ha llamado todavía
    expect(mockCreate).not.toHaveBeenCalled();

    // 3. Verificar modal (Título actualizado a "Create Week")
    expect(screen.getByText("Create Week")).toBeInTheDocument();
    expect(
      screen.getByText(/Create Week 25 for year 2023?/i),
    ).toBeInTheDocument();

    // 4. Confirmar (Botón actualizado a "Yes, Create")
    const confirmBtn = screen.getByRole("button", { name: "Yes, Create" });
    await user.click(confirmBtn);

    // 5. Verificar llamada
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      numberWeek: 25,
      year: 2023,
    });

    // 6. Verificar limpieza
    await waitFor(() => {
      expect(createInput).toHaveValue("");
      expect(screen.queryByText("Create Week")).not.toBeInTheDocument();
    });
  });

  it("debe cancelar la CREACIÓN si se cierra el modal", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const createInput = screen.getByPlaceholderText("New Week (1 - 53)");
    await user.type(createInput, "30");

    await user.click(screen.getByRole("button", { name: /add/i }));

    // Cancelar (El botón suele ser el secundario o tener texto Cancel)
    // Buscamos por texto "Cancel" que suele estar en los modales genéricos
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(mockCreate).not.toHaveBeenCalled();
    expect(screen.queryByText("Create Week")).not.toBeInTheDocument();
    // El input mantiene valor
    expect(createInput).toHaveValue("30");
  });

  // --- TESTS DE BORRADO (WeekList) ---

  it("debe abrir el modal de confirmación y borrar la semana SOLO al confirmar", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    // Buscamos los botones de borrado por su título accesible
    const deleteButtons = screen.getAllByTitle("Delete week");
    await user.click(deleteButtons[0]);

    expect(screen.getByText("Delete Week")).toBeInTheDocument();
    expect(mockDel).not.toHaveBeenCalled();

    // Confirmar (Botón actualizado a "Yes, Delete")
    const confirmBtn = screen.getByRole("button", { name: "Yes, Delete" });
    await user.click(confirmBtn);

    expect(mockDel).toHaveBeenCalledTimes(1);
    expect(mockDel).toHaveBeenCalledWith({ id: "week-1" });
  });

  it("debe cerrar el modal y NO borrar si se pulsa Cancelar", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const deleteButtons = screen.getAllByTitle("Delete week");
    await user.click(deleteButtons[0]);

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(screen.queryByText("Delete Week")).not.toBeInTheDocument();
    expect(mockDel).not.toHaveBeenCalled();
  });

  // --- TEST DE CALORÍAS ---

  it("debe mostrar correctamente el recuento total de calorías de la semana", () => {
    renderWithRedux(<WeekSearch />);
    // Semana 12 en fixture tiene 550 kcal.
    // Al quitar toLocaleString(), el formato es simple "550 kcal".
    expect(screen.getByText(/Week 12/i)).toBeInTheDocument();
    expect(screen.getByText(/550 kcal/i)).toBeInTheDocument();
  });
});
