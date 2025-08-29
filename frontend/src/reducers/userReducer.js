import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import signupService from "../services/signup";
import weekService from "../services/weeks";

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
      weekService.setToken(user.token); //De momento lo dejo así, luego voy a usar un API Client o algo parecido,
    }
  };
};

export const saveGlobalUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem("token", JSON.stringify(user));
      dispatch(setUser(user));
      weekService.setToken(user.token); //De momento lo dejo así, luego voy a usar un API Client o algo parecido,
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
    weekService.setToken(null); //De momento lo dejo así, luego voy a usar un API Client o algo parecido,
  };
};

export default userSlice.reducer;
