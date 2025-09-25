import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUser, clearUser } from "../reducers/userReducer";
import { clearWeeks } from "../reducers/weekReducer";
import { clearMyAliments } from "../reducers/myAlimentReducer";

const useAuthInitAndSync = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  useEffect(() => {
    const handleStorageChange = () => {
      const tokenJSON = window.localStorage.getItem("token");
      if (!tokenJSON && user) {
        dispatch(clearUser());
        dispatch(clearWeeks());
        dispatch(clearMyAliments());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      const tokenJSON = window.localStorage.getItem("token");
      if (!tokenJSON && user) {
        dispatch(clearUser());
        dispatch(clearWeeks());
        dispatch(clearMyAliments());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user, dispatch]);
};

export default useAuthInitAndSync;
