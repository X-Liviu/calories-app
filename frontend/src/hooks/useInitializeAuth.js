import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeUser } from "../reducers/userReducer";

const useInitializeAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);
};

export default useInitializeAuth;
