import { createSlice } from "@reduxjs/toolkit";

import loginService from "../../services/login";
import signupService from "../../services/signup";
import weekService from "../../services/weeks";
import myAlimentService from "../../services/myAliments";
import dayService from "../../services/days";
import mealService from "../../services/meals";
import alimentService from "../../services/aliments";

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
      //De momento lo dejo así, luego voy a usar un API Client o algo parecido
      signupService.setToken(user.token);
      weekService.setToken(user.token);
      myAlimentService.setToken(user.token);
      dayService.setToken(user.token);
      mealService.setToken(user.token);
      alimentService.setToken(user.token);
    }
  };
};

export const saveGlobalUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem("token", JSON.stringify(user));
      dispatch(setUser(user));
      //De momento lo dejo así, luego voy a usar un API Client o algo parecido,
      signupService.setToken(user.token);
      weekService.setToken(user.token);
      myAlimentService.setToken(user.token);
      dayService.setToken(user.token);
      mealService.setToken(user.token);
      alimentService.setToken(user.token);

      return { success: true };
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
    //De momento lo dejo así, luego voy a usar un API Client o algo parecido,
    signupService.setToken(null);
    weekService.setToken(null);
    myAlimentService.setToken(null);
    dayService.setToken(null);
    mealService.setToken(null);
    alimentService.setToken(null);
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
