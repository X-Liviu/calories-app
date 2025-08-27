import { createSlice } from "@reduxjs/toolkit";

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
      //blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  };
};

export const saveGlobalUser = (user) => {
  return (dispatch) => {
    try {
      window.localStorage.setItem("token", JSON.stringify(user));
      //blogService.setToken(user.token);
      dispatch(setUser(user));
      //return user; No hace falta de momento, igual en el futuro lo necesito. Lo dejo comentado.
    } catch (error) {
      console.error(error);
    }
  };
};

export const eraseGlobalUser = () => {
  return (dispatch) => {
    //blogService.setToken(null);
    window.localStorage.removeItem("token");
    dispatch(clearUser());
  };
};
export default userSlice.reducer;
