import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { initializeUser } from "../reducers/userReducer";

const useInitializeAuth = () => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await dispatch(initializeUser());
      setIsInitialized(true);
    };

    init();
  }, [dispatch]);

  return { isInitialized };
};

export default useInitializeAuth;
