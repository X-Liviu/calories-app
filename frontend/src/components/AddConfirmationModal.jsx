const AddConfirmationModal = ({
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action is permanent and cannot be undone.",
  confirmText = "Yes, Create",
  cancelText = "Cancel",
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-secondary">
            {cancelText}
          </button>

          <button onClick={onConfirm} className="btn btn-success">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddConfirmationModal;
