import { createSlice } from "@reduxjs/toolkit";
import weekService from "../services/weeks";
import dayService from "../services/days";
import mealService from "../services/meals";
import alimentService from "../services/aliments";

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
      dispatch(updateWeek(updatedWeek));
    } catch (error) {
      console.error(error);
    }
  };
};

export const removeDayInWeek = (day) => {
  return async (dispatch, getState) => {
    try {
      await dayService.del(day);

      //Tengo que actualizar la semana aquí ya que un delete con 204 NO PUEDE DEVOLVER NADA
      const { weeks } = getState();
      const week = weeks.find((w) => w.id === day.weekId);
      if (!week) return;

      const updatedWeek = {
        ...week,
        days: week.days.filter((d) => d.id !== day.dayId),
      };

      dispatch(updateWeek(updatedWeek));
    } catch (error) {
      console.error(error);
    }
  };
};

export const addMealInDay = (meal) => {
  return async (dispatch) => {
    try {
      const updatedWeek = await mealService.create(meal);
      dispatch(updateWeek(updatedWeek));
    } catch (error) {
      console.error(error);
    }
  };
};

export const changeMealInDay = (meal) => {
  return async (dispatch) => {
    try {
      const updatedWeek = await mealService.update(meal);
      dispatch(updateWeek(updatedWeek));
    } catch (error) {
      console.error(error);
    }
  };
};

export const removeMealInDay = (meal) => {
  return async (dispatch, getState) => {
    try {
      await mealService.del(meal);

      //Tengo que actualizar el día aquí ya que un delete con 204 NO PUEDE DEVOLVER NADA
      const { weeks } = getState();
      const week = weeks.find((w) => w.id === meal.weekId);
      if (!week) return;

      const day = week.days.find((d) => d.id === meal.dayId);
      if (!day) return;

      const updatedDay = {
        ...day,
        meals: day.meals.filter((m) => m.id !== meal.mealId),
      };

      const updatedWeek = {
        ...week,
        days: week.days.map((d) => (d.id === meal.dayId ? updatedDay : d)),
      };

      dispatch(updateWeek(updatedWeek));
    } catch (error) {
      console.error(error);
    }
  };
};

export const addAlimentInMeal = (aliment) => {
  return async (dispatch) => {
    try {
      const updatedWeek = await alimentService.create(aliment);
      dispatch(updateWeek(updatedWeek));
    } catch (error) {
      console.error(error);
    }
  };
};

export const changeAlimentInMeal = (aliment) => {
  return async (dispatch) => {
    try {
      const updatedWeek = await alimentService.update(aliment);
      dispatch(updateWeek(updatedWeek));
    } catch (error) {
      console.error(error);
    }
  };
};

export const removeAlimentInMeal = (aliment) => {
  return async (dispatch, getState) => {
    try {
      await alimentService.del(aliment);

      //Tengo que actualizar la comida aquí ya que un delete con 204 NO PUEDE DEVOLVER NADA
      const { weeks } = getState();
      const week = weeks.find((w) => w.id === aliment.weekId);
      if (!week) return;

      const day = week.days.find((d) => d.id === aliment.dayId);
      if (!day) return;

      const meal = day.meals.find((m) => m.id === aliment.mealId);
      if (!meal) return;

      const updatedMeal = {
        ...meal,
        aliments: meal.aliments.filter((a) => a.id !== aliment.mealAlimentId),
      };
      const updatedDay = {
        ...day,
        meals: day.meals.map((m) =>
          m.id === aliment.mealId ? updatedMeal : m,
        ),
      };

      const updatedWeek = {
        ...week,
        days: week.days.map((d) => (d.id === aliment.dayId ? updatedDay : d)),
      };

      dispatch(updateWeek(updatedWeek));
    } catch (error) {
      console.error(error);
    }
  };
};

export default weekSlice.reducer;
