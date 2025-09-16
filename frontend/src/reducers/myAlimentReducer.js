import { createSlice } from "@reduxjs/toolkit";
import myAlimentService from "../services/myAliments";

const myAlimentSlice = createSlice({
  name: "myAliments",
  initialState: [],
  reducers: {
    setMyAliments(state, action) {
      return action.payload;
    },
    appendMyAliment(state, action) {
      return state.concat(action.payload); //se puede hacer con un push si se quiere debido a la librería Immer de Toolkit
    },
    popMyAliment(state, action) {
      return state.filter((a) => a.id !== action.payload.id);
    },
    updateMyAliment(state, action) {
      const newState = state.map((a) =>
        a.id === action.payload.id ? action.payload : a,
      );
      console.log(newState);
      return newState;
    },
  },
});

export const { setMyAliments, appendMyAliment, popMyAliment, updateMyAliment } =
  myAlimentSlice.actions;
export const saveMyAliments = () => {
  return async (dispatch) => {
    try {
      const userAliments = await myAlimentService.getAll();
      dispatch(setMyAliments(userAliments));
    } catch (error) {
      console.error(error);
    }
  };
};

export const addMyAliment = (myAliment) => {
  return async (dispatch) => {
    try {
      const newMyAliment = await myAlimentService.create(myAliment);
      dispatch(appendMyAliment(newMyAliment));
    } catch (error) {
      console.error(error);
    }
  };
};

export const changeMyAliment = (myAliment) => {
  return async (dispatch, getState) => {
    try {
      const updatedAliment = await myAlimentService.update(myAliment);
      console.log(getState());
      console.log(updatedAliment);
      dispatch(updateMyAliment(updatedAliment));
    } catch (error) {
      console.error(error);
    }
  };
};

export const removeMyAliment = (myAliment) => {
  return async (dispatch) => {
    try {
      await myAlimentService.del(myAliment);
      dispatch(popMyAliment(myAliment));
    } catch (error) {
      console.error(error);
    }
  };
};

export default myAlimentSlice.reducer;
