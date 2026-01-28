import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Toggable from "../../src/components/Toggable";

describe("<Toggable />", () => {
  it("renderiza el botón con el label propocionado y oculta el contenido al inicio", () => {
    render(
      <Toggable buttonLabel="Mostrar Secreto">
        <div className="testDiv">Contenido Secreto</div>
      </Toggable>,
    );

    // El botón para abrir existe
    expect(screen.getByText("Mostrar Secreto")).toBeInTheDocument();

    // El contenido existe pero está oculto (display: none)
    const content = screen.getByText("Contenido Secreto");
    expect(content).not.toBeVisible();
  });

  it("muestra el contenido al hacer click en el botón", async () => {
    const user = userEvent.setup();
    render(
      <Toggable buttonLabel="Mostrar">
        <div>Contenido Visible</div>
      </Toggable>,
    );

    const button = screen.getByText("Mostrar");
    await user.click(button);

    const content = screen.getByText("Contenido Visible");
    expect(content).toBeVisible();
  });

  it("vuelve a ocultar el contenido al hacer click en Cancel", async () => {
    const user = userEvent.setup();
    render(
      <Toggable buttonLabel="Mostrar">
        <div>Hola Mundo</div>
      </Toggable>,
    );

    // 1. Abrir
    await user.click(screen.getByText("Mostrar"));
    const content = screen.getByText("Hola Mundo");
    expect(content).toBeVisible();

    // 2. Cerrar (Busca el botón Cancel que está dentro del componente)
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    // 3. Verificar que se ocultó
    expect(content).not.toBeVisible();
  });
});
