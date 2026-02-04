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
    <div className="profile-container">
      <div
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="profile-avatar"
        title={`Logged as ${user.username}`}
      >
        {userInitial}
      </div>

      {isMenuOpen && (
        <div
          className="profile-backdrop"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {isMenuOpen && (
        <div className="profile-dropdown">
          <div className="profile-user-info">
            <div className="profile-user-row">
              <MdPerson className="profile-menu-icon" />
              <span>{user.name}</span>
            </div>
            <span className="profile-username">@{user.username}</span>
          </div>

          <button
            onClick={() => {
              setIsEditOpen(true);
              setIsMenuOpen(false);
            }}
            className="profile-menu-item"
          >
            <MdEdit className="profile-menu-icon" />
            <span>Edit Profile</span>
          </button>

          <button onClick={handleLogout} className="profile-menu-item">
            <MdLogout className="profile-menu-icon" />
            <span>Logout</span>
          </button>

          <hr className="profile-divider" />

          <button
            onClick={handleDeleteClick}
            className="profile-menu-item text-danger"
          >
            <MdDeleteForever className="profile-menu-icon" />
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
          title="Delete Account"
          message="Are you sure? This action is permanent and cannot be undone."
          confirmText="Yes, delete my account"
        />
      )}
    </div>
  );
};

export default ProfileMenu;
