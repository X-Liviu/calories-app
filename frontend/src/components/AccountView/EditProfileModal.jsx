import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { validateUpdateUserForm } from "../../utils/validations"; // Importamos el validador

const EditProfileModal = ({ user, onClose }) => {
  const { editUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    currentPassword: "",
    newPassword: "",
    newPasswordRepeated: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiamos el error del campo al escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validamos en Frontend antes de enviar
    const validation = validateUpdateUserForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      // Enviamos solo los datos necesarios
      // Si los campos de password están vacíos, el backend los ignorará
      await editUser(formData);
      onClose();
    } catch (exception) {
      console.error(`Error updating profile: ${exception}`);
      // Si el backend devuelve error (ej. contraseña actual incorrecta), lo mostramos
      // Asumiendo que tu backend devuelve { error: "mensaje" }
      if (
        exception.response &&
        exception.response.data &&
        exception.response.data.error
      ) {
        alert(exception.response.data.error);
      }
    }
  };

  // Estilos simples
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "90vh",
    overflowY: "auto", // Por si crece mucho el modal
  };

  const errorStyle = {
    color: "red",
    fontSize: "0.8em",
    marginTop: "-8px",
    marginBottom: "5px",
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Edit Profile</h3>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {/* NOMBRE */}
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                border: errors.name ? "1px solid red" : "1px solid #ccc",
              }}
            />
          </label>
          {errors.name && <span style={errorStyle}>{errors.name}</span>}

          {/* USERNAME */}
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: "100%",
                border: errors.username ? "1px solid red" : "1px solid #ccc",
              }}
            />
          </label>
          {errors.username && <span style={errorStyle}>{errors.username}</span>}

          <hr style={{ width: "100%", margin: "5px 0" }} />
          <small>Leave blank to keep current password</small>

          {/* CURRENT PASSWORD */}
          <label>
            Current Password:
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                border: errors.currentPassword
                  ? "1px solid red"
                  : "1px solid #ccc",
              }}
            />
          </label>
          {errors.currentPassword && (
            <span style={errorStyle}>{errors.currentPassword}</span>
          )}

          {/* NEW PASSWORD */}
          <label>
            New Password:
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                border: errors.newPassword ? "1px solid red" : "1px solid #ccc",
              }}
            />
          </label>
          {errors.newPassword && (
            <span style={errorStyle}>{errors.newPassword}</span>
          )}

          {/* REPEAT NEW PASSWORD */}
          <label>
            Repeat New Password:
            <input
              type="password"
              name="newPasswordRepeated"
              value={formData.newPasswordRepeated}
              onChange={handleChange}
              style={{
                width: "100%",
                border: errors.newPasswordRepeated
                  ? "1px solid red"
                  : "1px solid #ccc",
              }}
            />
          </label>
          {errors.newPasswordRepeated && (
            <span style={errorStyle}>{errors.newPasswordRepeated}</span>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
