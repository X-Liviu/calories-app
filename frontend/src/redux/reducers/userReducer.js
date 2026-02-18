import { createSlice } from "@reduxjs/toolkit";

import loginService from "../../services/login";
import signupService from "../../services/signup";

import { clearWeeks } from "./weekReducer";
import { clearMyAliments } from "./myAlimentReducer";
import { displayNotification } from "./uiReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("token");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  };
};

export const saveGlobalUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem("token", JSON.stringify(user));
      dispatch(setUser(user));
    } catch (error) {
      dispatch(displayNotification(error));
      return { success: false };
    }
  };
};

export const signupUser = (userInfo) => {
  return async (dispatch) => {
    try {
      await signupService.signup(userInfo);

      const { email, password } = userInfo;
      const loginResult = await dispatch(saveGlobalUser({ email, password }));

      return loginResult;
    } catch (error) {
      dispatch(displayNotification(error));
      return { success: false };
    }
  };
};

export const eraseGlobalUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem("token");
    dispatch(clearUser());
    dispatch(clearWeeks());
    dispatch(clearMyAliments());
  };
};

export const updateUser = (newUserData) => {
  return async (dispatch) => {
    try {
      const updatedUser = await signupService.update(newUserData);

      // NOTA: El backend devuelve el usuario actualizado, pero a veces no devuelve el token.
      // Mantenemos el token que ya teníamos en localStorage.
      const loggedUserJSON = window.localStorage.getItem("token");
      const currentUser = JSON.parse(loggedUserJSON);

      const userToSave = { ...currentUser, ...updatedUser };

      window.localStorage.setItem("token", JSON.stringify(userToSave));
      dispatch(setUser(userToSave));

      return { success: true };
    } catch (error) {
      dispatch(displayNotification(error));
      return { success: false };
    }
  };
};

export const deleteUser = () => {
  return async (dispatch) => {
    try {
      await signupService.del();
      dispatch(eraseGlobalUser());

      return { success: true };
    } catch (error) {
      dispatch(displayNotification(error));
      return { success: false };
    }
  };
};

export default userSlice.reducer;
