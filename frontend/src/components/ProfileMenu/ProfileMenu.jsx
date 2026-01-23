import { useState } from "react";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";

import { MdEdit, MdLogout, MdDeleteForever, MdPerson } from "react-icons/md";

import EditProfileModal from "./EditProfileModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const ProfileMenu = () => {
  const user = useSelector((state) => state.user);
  const { logout, deleteAcc } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };
  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
    setIsMenuOpen(false);
  };
  const confirmDelete = async () => {
    await deleteAcc();
    setIsDeleteOpen(false);
  };
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={styles.avatar}
        title={user.username}
      >
        {userInitial}
      </div>

      {isMenuOpen && (
        <div style={styles.backdrop} onClick={() => setIsMenuOpen(false)} />
      )}

      {isMenuOpen && (
        <div style={styles.menuDropdown}>
          <div style={styles.userInfo}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginBottom: "5px",
              }}
            >
              <MdPerson size={18} color="#666" /> <strong>{user.name}</strong>
            </div>
            <small style={{ marginLeft: "23px" }}>@{user.username}</small>
          </div>
          <hr style={styles.divider} />

          <button
            onClick={() => {
              setIsEditOpen(true);
              setIsMenuOpen(false);
            }}
            style={styles.menuItem}
          >
            <MdEdit size={20} />
            <span>Edit Profile</span>
          </button>

          <button onClick={handleLogout} style={styles.menuItem}>
            <MdLogout size={20} color="#555" />
            <span>Logout</span>
          </button>

          <hr style={styles.divider} />

          <button
            onClick={handleDeleteClick}
            style={{ ...styles.menuItem, color: "#d32f2f" }}
          >
            <MdDeleteForever size={20} />
            <span>Delete Account</span>
          </button>
        </div>
      )}

      {isEditOpen && (
        <EditProfileModal user={user} onClose={() => setIsEditOpen(false)} />
      )}
      {isDeleteOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          title="¿Are you sure?"
          message="This action is permanent. All data will be deleted forever."
          confirmText="Yes, delete my account."
        />
      )}
    </div>
  );
};

const styles = {
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.2rem",
    cursor: "pointer",
    userSelect: "none",
    border: "2px solid white",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
    cursor: "default",
  },
  menuDropdown: {
    position: "absolute",
    top: "120%",
    right: 0,
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    padding: "10px 0",
    minWidth: "200px",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  userInfo: {
    padding: "10px 15px",
    fontSize: "0.9rem",
    color: "#333",
    backgroundColor: "#f9f9f9",
    borderBottom: "1px solid #eee",
  },
  divider: {
    border: "0",
    borderTop: "1px solid #eee",
    margin: "5px 0",
    width: "100%",
  },

  menuItem: {
    background: "none",
    border: "none",
    padding: "12px 15px",
    textAlign: "left",
    cursor: "pointer",
    width: "100%",
    fontSize: "0.95rem",
    transition: "background 0.2s",
    color: "#333",

    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
};

export default ProfileMenu;
