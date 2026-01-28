import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import RedirectIfAuthenticated from "../../src/components/RedirectIfAuthenticated";
import userReducer from "../../src/redux/reducers/userReducer";
import { mockUser } from "../textFixtures";

// --- RENDER HELPER PERSONALIZADO ---
// Necesitamos pasar initialEntries como objeto para simular el "state" del router
const renderWithRouter = ({ userState, initialEntries }) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: userState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          {/* Ruta donde "viviría" el componente (ej: /login) */}
          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/login" element={<h1>Formulario de Login</h1>} />
          </Route>

          {/* Rutas de destino posibles */}
          <Route path="/weeks" element={<h1>Weeks Dashboard</h1>} />
          <Route path="/checkout" element={<h1>Checkout Page</h1>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe("RedirectIfAuthenticated Component", () => {
  it("debe mostrar el contenido (Login) si el usuario NO está autenticado", () => {
    renderWithRouter({
      userState: null,
      initialEntries: ["/login"],
    });

    expect(screen.getByText("Formulario de Login")).toBeInTheDocument();
  });

  it("debe redirigir a /weeks por defecto si el usuario está autenticado y no hay historial", () => {
    renderWithRouter({
      userState: mockUser,
      initialEntries: ["/login"], // Usuario logueado intenta ir a login
    });

    // Debe echarlo a /weeks
    expect(screen.getByText("Weeks Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Formulario de Login")).not.toBeInTheDocument();
  });

  it("debe redirigir a la ruta previa (state.from) si existe", () => {
    // Simulamos que el usuario intentó entrar a /checkout, fue mandado al login,
    // se logueó, y ahora el componente debe devolverlo a /checkout.
    const entryWithState = {
      pathname: "/login",
      state: { from: { pathname: "/checkout" } },
    };

    renderWithRouter({
      userState: mockUser,
      initialEntries: [entryWithState],
    });

    // Debe redirigir a Checkout, NO a Weeks
    expect(screen.getByText("Checkout Page")).toBeInTheDocument();
    expect(screen.queryByText("Weeks Dashboard")).not.toBeInTheDocument();
  });
});
