import { createSlice } from "@reduxjs/toolkit";

import loginService from "../services/login";
import signupService from "../services/signup";

import weekService from "../services/weeks";
import myAlimentService from "../services/myAliments";
import dayService from "../services/days";
import mealService from "../services/meals";
import alimentService from "../services/aliments";

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
      weekService.setToken(user.token);
      myAlimentService.setToken(user.token);
      dayService.setToken(user.token);
      mealService.setToken(user.token);
      alimentService.setToken(user.token);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
};

export const signupUser = (userInfo) => {
  return async (dispatch) => {
    try {
      await signupService.signup(userInfo);

      const { email, password } = userInfo;
      await dispatch(saveGlobalUser({ email, password }));
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };
};

export const eraseGlobalUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem("token");
    dispatch(clearUser());
    //De momento lo dejo así, luego voy a usar un API Client o algo parecido,
    weekService.setToken(null);
    myAlimentService.setToken(null);
    dayService.setToken(null);
    mealService.setToken(null);
    alimentService.setToken(null);
  };
};

export default userSlice.reducer;
