import { createSlice } from "@reduxjs/toolkit";
import weekService from "../services/weeks";

const weekSlice = createSlice({
  name: "weeks",
  initialState: [],
  reducers: {
    setWeeks(state, action) {
      return action.payload;
    },
    appendWeek(state, action) {
      return state.concat(action.payload); //se puede hacer con un push si se quiere debido a la librería Immer de Toolkit
    },
  },
});

export const { setWeeks, appendWeek } = weekSlice.actions;
export const saveGlobalWeeks = () => {
  return async (dispatch) => {
    try {
      const weeks = await weekService.getAll();
      dispatch(setWeeks(weeks));
    } catch (error) {
      console.error(error);
    }
  };
};

export const addWeek = (week) => {
  return async (dispatch) => {
    try {
      const newWeek = await weekService.create(week);
      dispatch(appendWeek(newWeek));
    } catch (error) {
      console.error(error);
    }
  };
};

export default weekSlice.reducer;
