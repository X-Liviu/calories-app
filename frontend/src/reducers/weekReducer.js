import { createSlice } from "@reduxjs/toolkit";
import weekService from "../services/weeks";
import dayService from "../services/days";

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
    updateWeek(state, action) {
      return state.map((w) =>
        w.id === action.payload.id ? action.payload : w,
      );
    },
  },
});

export const { setWeeks, appendWeek, popWeek, updateWeek } = weekSlice.actions;
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

export const addDayInWeek = (day) => {
  return async (dispatch) => {
    try {
      const updatedWeek = await dayService.create(day);
      dispatch(updateWeek(updatedWeek)); // Nuevo action
    } catch (error) {
      console.error(error);
    }
  };
};

//TODO
export const removeDayInWeek = (day) => {
  return async (dispatch) => {
    try {
      const updatedWeek = await dayService.del(day);
      dispatch(updateWeek(updatedWeek)); // Nuevo action
    } catch (error) {
      console.error(error);
    }
  };
};

export default weekSlice.reducer;
