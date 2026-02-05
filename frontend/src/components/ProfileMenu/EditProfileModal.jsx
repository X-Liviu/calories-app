import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { validateUpdateUserForm } from "../../utils/validations";

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar error al escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateUpdateUserForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await editUser(formData);
      onClose();
    } catch (exception) {
      console.error(`Error updating profile: ${exception}`);
    }
  };

  return (
    <div className="modal-overlay">
      {/* Añadimos animate-enter para que aparezca suavemente */}
      <div className="modal-box profile-edit animate-enter">
        <h3>Edit Profile</h3>

        <form onSubmit={handleSubmit} className="profile-edit-form">
          {/* Nombre */}
          <div className="form-group-vertical">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? "input-error" : ""}`}
            />
            {/* CORREGIDO: Clase CSS en lugar de style inline */}
            {errors.name && <span className="text-error">{errors.name}</span>}
          </div>

          {/* Usuario (Deshabilitado o editable según lógica, aquí editable) */}
          <div className="form-group-vertical">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`input-field ${errors.username ? "input-error" : ""}`}
            />
            {errors.username && (
              <span className="text-error">{errors.username}</span>
            )}
          </div>

          <hr className="modal-divider" />
          <p className="text-hint">
            Leave passwords blank to keep current one.
          </p>

          {/* Contraseña Actual (Requerida para cambios sensibles) */}
          <div className="form-group-vertical">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`input-field ${
                errors.currentPassword ? "input-error" : ""
              }`}
            />
            {errors.currentPassword && (
              <span className="text-error">{errors.currentPassword}</span>
            )}
          </div>

          {/* Nueva Contraseña */}
          <div className="form-group-vertical">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`input-field ${errors.newPassword ? "input-error" : ""}`}
            />
            {errors.newPassword && (
              <span className="text-error">{errors.newPassword}</span>
            )}
          </div>

          {/* Repetir Nueva Contraseña */}
          <div className="form-group-vertical">
            <label htmlFor="newPasswordRepeated">Repeat New Password</label>
            <input
              id="newPasswordRepeated"
              type="password"
              name="newPasswordRepeated"
              value={formData.newPasswordRepeated}
              onChange={handleChange}
              className={`input-field ${
                errors.newPasswordRepeated ? "input-error" : ""
              }`}
            />
            {errors.newPasswordRepeated && (
              <span className="text-error">{errors.newPasswordRepeated}</span>
            )}
          </div>

          {/* Acciones */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
