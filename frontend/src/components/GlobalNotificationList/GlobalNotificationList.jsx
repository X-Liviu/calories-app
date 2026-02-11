import { useSelector } from "react-redux";
import GlobalNotificationItemList from "./GlobalNotificationItemList";

const GlobalNotificationList = () => {
  const notifications = useSelector((state) => state.ui.notifications);

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="toast-stack-wrapper">
      {notifications.map((note) => (
        <GlobalNotificationItemList key={note.id} notification={note} />
      ))}
    </div>
  );
};

export default GlobalNotificationList;
