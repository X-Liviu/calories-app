const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ marginTop: 0 }}>¿Estás seguro?</h3>
        <p>
          Esta acción es permanente. Todos los datos guardados con este usuario
          serán eliminados.
        </p>

        <div style={styles.buttonContainer}>
          <button onClick={onClose} style={styles.cancelButton}>
            Cancelar
          </button>

          <button onClick={onConfirm} style={styles.deleteButton}>
            Sí, borrar cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

// Estilos básicos para que funcione al copiar y pegar
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },
  cancelButton: {
    padding: "8px 16px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 16px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default DeleteConfirmationModal;
