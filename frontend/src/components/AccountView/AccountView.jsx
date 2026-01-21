import { useState } from "react";
import { useSelector } from "react-redux";

import useAuth from "../../hooks/useAuth";

import Logout from "./Logout";
import EditProfileModal from "./EditProfileModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const AccountView = () => {
  const user = useSelector((state) => state.user);
  const { deleteAcc } = useAuth();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };
  const confirmDelete = async () => {
    await deleteAcc();
    setIsDeleteOpen(false);
  };

  return (
    <>
      <h2>{user.name}, you logged in succesfully!</h2>

      <button onClick={() => setIsEditOpen(true)}>Edit Profile</button>

      <Logout />

      <button style={{ color: "red" }} onClick={handleDelete}>
        Delete your account
      </button>

      {isEditOpen && (
        <EditProfileModal user={user} onClose={() => setIsEditOpen(false)} />
      )}

      {isDeleteOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default AccountView;
