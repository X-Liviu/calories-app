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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      if (
        exception.response &&
        exception.response.data &&
        exception.response.data.error
      ) {
        console.error(exception.response.data.error);
      }
    }
  };

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
    overflowY: "auto",
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
