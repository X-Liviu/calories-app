const DeleteConfirmationModal = ({
  onClose,
  onConfirm,
  title = "Delete Week",
  message = "This action is permanent.",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>{title}</h3>

          <div className="warning-icon-container">
            !
            <span className="warning-tooltip-text">
              This operation involves complex data and may take a few seconds to
              complete. Please be patient.
            </span>
          </div>
        </div>

        <p>{message}</p>

        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-secondary">
            {cancelText}
          </button>

          <button onClick={onConfirm} className="btn btn-danger">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
