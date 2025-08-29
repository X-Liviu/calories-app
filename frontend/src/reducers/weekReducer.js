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
    popWeek(state, action) {
      return state.filter((w) => w.id !== action.payload.id);
    },
  },
});

export const { setWeeks, appendWeek, popWeek } = weekSlice.actions;
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

export const removeWeek = (week) => {
  return async (dispatch) => {
    try {
      await weekService.del(week);
      dispatch(popWeek(week));
    } catch (error) {
      console.error(error);
    }
  };
};

export default weekSlice.reducer;
