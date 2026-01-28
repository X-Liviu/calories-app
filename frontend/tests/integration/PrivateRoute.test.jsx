import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect } from "vitest";
import PrivateRoute from "../../src/components/PrivateRoute";
import userReducer from "../../src/redux/reducers/userReducer.js";

// Helper para crear un store de prueba rápido
const createTestStore = (preloadedState) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
  });
};

describe("<PrivateRoute />", () => {
  it("redirige al login si NO hay usuario autenticado", () => {
    const store = createTestStore({ user: null }); // Estado inicial: nadie logueado

    render(
      <Provider store={store}>
        {/* MemoryRouter simula la barra de direcciones del navegador */}
        <MemoryRouter initialEntries={["/ruta-protegida"]}>
          <Routes>
            <Route path="/login" element={<h1>Página de Login</h1>} />

            {/* La ruta que queremos probar */}
            <Route element={<PrivateRoute />}>
              <Route
                path="/ruta-protegida"
                element={<h1>Contenido Secreto</h1>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    // No debería ver el contenido secreto
    expect(screen.queryByText("Contenido Secreto")).not.toBeInTheDocument();
    // Debería ver la página de login (la redirección funcionó)
    expect(screen.getByText("Página de Login")).toBeInTheDocument();
  });

  it("permite el acceso si HAY usuario autenticado", () => {
    const store = createTestStore({
      user: { token: "123", username: "juan" }, // Usuario logueado
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/ruta-protegida"]}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route
                path="/ruta-protegida"
                element={<h1>Contenido Secreto</h1>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    // Debería ver el contenido secreto
    expect(screen.getByText("Contenido Secreto")).toBeInTheDocument();
  });
});
