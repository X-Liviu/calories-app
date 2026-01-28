import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom"; // Necesario porque WeekList usa useNavigate

// Componentes
import WeekSearch from "../../src/components/WeekSearch/WeekSearch.jsx";

// Reducers reales
import userReducer from "../../src/redux/reducers/userReducer.js";
import weekReducer from "../../src/redux/reducers/weekReducer.js";
import yearReducer from "../../src/redux/reducers/yearReducer.js";
import myAlimentReducer from "../../src/redux/reducers/myAlimentReducer.js";

// Fixtures
import { mockLoadedState } from "../textFixtures.js";

// 1. MOCKEAMOS LOS HOOKS QUE HACEN LLAMADAS O LÓGICA COMPLEJA
// Mockeamos useYearManager para verificar si se intenta cambiar el año
const mockChangeYear = vi.fn();
vi.mock("../../src/hooks/useYearManager", () => ({
  default: () => ({
    changeYear: mockChangeYear,
  }),
}));

// Mockeamos useWeeks (usado por WeekList para borrar) para que no rompa
const mockDel = vi.fn();
vi.mock("../../src/hooks/useWeeks", () => ({
  default: () => ({
    del: mockDel,
  }),
}));

// Mockeamos WeekForm para reducir ruido (nos centramos en la búsqueda y lista)
vi.mock("../../src/components/WeekSearch/WeekForm", () => ({
  default: () => <div data-testid="mock-week-form">Formulario Semana</div>,
}));

// Mockeamos SkeletonWeeks para evitar animaciones en tests
vi.mock("../../src/components/WeekSearch/SkeletonWeeks", () => ({
  default: () => <div data-testid="skeleton">Cargando...</div>,
}));

// FUNCIÓN HELPER PARA RENDERIZAR CON REDUX
const renderWithRedux = (component, preloadedState = mockLoadedState) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      weeks: weekReducer,
      year: yearReducer,
      myAliments: myAlimentReducer, // No necesitamos myAliments ni otros para este test, pero es para quitar el warning feo
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe("<WeekSearch /> Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el selector de años con las opciones correctas basado en el usuario", () => {
    // El usuario "since: 2020" y el año actual es 2023.
    // Debería mostrar 2023, 2022, 2021, 2020.
    renderWithRedux(<WeekSearch />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Verificamos que el valor seleccionado es el del estado inicial (2023)
    expect(select.value).toBe("2023");

    // Verificamos que existen las opciones
    expect(screen.getByRole("option", { name: "2023" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2020" })).toBeInTheDocument();
  });

  it("llama a changeYear cuando el usuario selecciona otro año", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const select = screen.getByRole("combobox");

    // El usuario cambia al año 2021
    await user.selectOptions(select, "2021");

    expect(mockChangeYear).toHaveBeenCalledTimes(1);
    expect(mockChangeYear).toHaveBeenCalledWith(2021);
  });

  it("renderiza la lista de semanas correctamente (WeekList)", () => {
    // Como usamos mockLoadedState, tenemos week-1 (Semana 10) y week-2 (Semana 11)
    renderWithRedux(<WeekSearch />);

    // Verificamos que WeekList renderizó los ítems
    expect(screen.getByText(/Week 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Week 11/i)).toBeInTheDocument();
  });

  it("filtra la lista de semanas cuando el usuario escribe en el input de búsqueda", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    // Buscamos el input de búsqueda "Search your number of the week"
    // Nota: Tu input no tiene label asociado con 'htmlFor', así que buscamos por display value inicial o placeholder si tuviera.
    // Como tu input en WeekSearch.jsx no tiene placeholder, lo buscamos por el rol genérico 'textbox' o el texto cercano.
    // Mejor estrategia: Buscar el textbox que está al lado del texto.
    const searchInput = screen.getByRole("textbox");

    // Al principio están las dos semanas
    expect(screen.getByText(/Week 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Week 11/i)).toBeInTheDocument();

    // 1. Escribimos "10" para filtrar
    await user.type(searchInput, "10");

    // Week 10 debería estar, Week 11 debería desaparecer
    expect(screen.getByText(/Week 10/i)).toBeInTheDocument();
    expect(screen.queryByText(/Week 11/i)).not.toBeInTheDocument();
  });

  it("muestra mensaje de 'no encontrado' si el filtro no coincide con nada", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    const searchInput = screen.getByRole("textbox");

    // Escribimos una semana que no existe (ej: 50)
    await user.type(searchInput, "50");

    expect(screen.getByText(/Week 50/i)).toBeInTheDocument(); // Parte del mensaje "Week 50 was not found"
    expect(screen.getByText(/was not found/i)).toBeInTheDocument();
  });

  it("valida que el input de búsqueda solo acepte números y longitud máxima 2", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);
    const searchInput = screen.getByRole("textbox");

    // Intentamos escribir letras "abc"
    await user.type(searchInput, "abc");
    expect(searchInput).toHaveValue(""); // No debería escribir nada

    // Intentamos escribir 3 números "123"
    await user.type(searchInput, "123");
    // Tu lógica dice: target.value.length <= 2, así que el tercer digito no entra en el estado
    expect(searchInput).toHaveValue("12");
  });

  it("debe abrir el modal de confirmación y borrar la semana SOLO al confirmar", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    // 1. Buscamos los botones de borrar (❌)
    // Como hay varias semanas, `getAllByText` nos devuelve un array. Cogemos el primero.
    const deleteButtons = screen.getAllByText("❌");
    const firstDeleteBtn = deleteButtons[0];

    // 2. Hacemos click en borrar
    await user.click(firstDeleteBtn);

    // 3. VERIFICAMOS QUE EL MODAL SE ABRE
    // Buscamos por el texto del título o del mensaje del modal
    expect(screen.getByText("Delete Week")).toBeInTheDocument();

    // IMPORTANTE: Verificamos que 'del' AÚN NO se ha llamado (el modal debe prevenirlo)
    expect(mockDel).not.toHaveBeenCalled();

    // 4. Confirmamos el borrado
    // Buscamos el botón "Yes, I confirm" que definiste en tus props por defecto
    const confirmBtn = screen.getByRole("button", { name: /Yes, I confirm/i });
    await user.click(confirmBtn);

    // 5. VERIFICAMOS QUE AHORA SÍ SE LLAMÓ A BORRAR
    expect(mockDel).toHaveBeenCalledTimes(1);
    // Verificamos que se llamó con el ID correcto (según tus fixtures, la primera semana es week-1)
    expect(mockDel).toHaveBeenCalledWith({ id: "week-1" });
  });

  it("debe cerrar el modal y NO borrar si se pulsa Cancelar", async () => {
    const user = userEvent.setup();
    renderWithRedux(<WeekSearch />);

    // 1. Abrimos el modal
    const deleteButtons = screen.getAllByText("❌");
    await user.click(deleteButtons[0]);

    // 2. Pulsamos cancelar
    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelBtn);

    // 3. Verificamos que el modal desapareció
    // queryByText devuelve null si no lo encuentra (en vez de lanzar error)
    expect(screen.queryByText("Delete Week")).not.toBeInTheDocument();

    // 4. Verificamos que NO se llamó a borrar
    expect(mockDel).not.toHaveBeenCalled();
  });

  it("debe mostrar correctamente el recuento total de calorías de la semana", () => {
    // Usamos el estado cargado que ahora incluye mockWeekWithCalories (Semana 12)
    renderWithRedux(<WeekSearch />);

    // La semana 12 tiene un día con 550 kcal (200 + 350)
    // Verificamos que aparece el número de semana
    expect(screen.getByText(/Week 12/i)).toBeInTheDocument();

    // Verificamos que aparece el total de calorías correcto
    // El formato en tu componente es: "Week 12 (550 kcal)"
    expect(screen.getByText(/550 kcal/i)).toBeInTheDocument();
  });
});
