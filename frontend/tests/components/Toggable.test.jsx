import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Toggable from "../../src/components/Toggable";

describe("<Toggable />", () => {
  it("renderiza el botón con el label proporcionado y NO renderiza el contenido al inicio", () => {
    render(
      <Toggable buttonLabel="Mostrar Secreto">
        <div className="testDiv">Contenido Secreto</div>
      </Toggable>,
    );

    // El botón para abrir existe
    expect(
      screen.getByRole("button", { name: "Mostrar Secreto" }),
    ).toBeInTheDocument();

    // El contenido NO debe estar en el documento (renderizado condicional)
    // Usamos queryByText para que no lance error si no lo encuentra
    const content = screen.queryByText("Contenido Secreto");
    expect(content).not.toBeInTheDocument();
  });

  it("muestra el contenido al hacer click en el botón", async () => {
    const user = userEvent.setup();
    render(
      <Toggable buttonLabel="Mostrar">
        <div>Contenido Visible</div>
      </Toggable>,
    );

    const button = screen.getByRole("button", { name: "Mostrar" });
    await user.click(button);

    // Ahora el contenido DEBE estar en el documento
    const content = screen.getByText("Contenido Visible");
    expect(content).toBeInTheDocument();

    // El botón de abrir desaparece cuando se muestra el contenido
    expect(screen.queryByText("Mostrar")).not.toBeInTheDocument();
  });

  it("oculta el contenido (lo desmonta) al hacer click en Cancel", async () => {
    const user = userEvent.setup();
    render(
      <Toggable buttonLabel="Mostrar">
        <div>Hola Mundo</div>
      </Toggable>,
    );

    // 1. Abrir
    await user.click(screen.getByRole("button", { name: "Mostrar" }));
    expect(screen.getByText("Hola Mundo")).toBeInTheDocument();

    // 2. Cerrar (Busca el botón Cancel que aparece dentro)
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    // 3. Verificar que se eliminó del DOM
    expect(screen.queryByText("Hola Mundo")).not.toBeInTheDocument();

    // El botón de abrir vuelve a aparecer
    expect(screen.getByRole("button", { name: "Mostrar" })).toBeInTheDocument();
  });
});
