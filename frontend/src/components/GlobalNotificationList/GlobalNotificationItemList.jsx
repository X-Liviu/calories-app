import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeNotification } from "../../redux/reducers/uiReducer";

const GlobalNotificationItemList = ({ notification }) => {
  const dispatch = useDispatch();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 400);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const variantClass =
    notification.type === "success" ? "toast-success" : "toast-error";

  const animationClass = isExiting ? "toast-exit" : "toast-enter";

  return (
    <div
      className={`toast-card ${variantClass} ${animationClass}`}
      role="alert"
    >
      <span className="toast-message">{notification.message}</span>
      <button
        className="toast-close-btn"
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
};

export default GlobalNotificationItemList;
