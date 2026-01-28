import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = [{ name: "Home", URL: "/" }];
const itemLinkSlice = createSlice({
  name: "itemLinks",
  initialState: INITIAL_STATE,
  reducers: {
    //Solución de ChatGPT
    setItem(state, action) {
      const idx = state.findIndex((i) => i.URL === action.payload.URL);

      if (idx === -1) return [...state, action.payload];
      else return state.slice(0, idx + 1);
    },
    /*Primera solución que propuse yo solo, bastante complicada en el sentido de que hay mucho texto.
    setItem(state, action) {
      let enc = false;
      let i = 0;
      let newState = [];
      while (!enc && i < state.length) {
        if (state[i].URL === action.payload.URL) {
          newState.push(action.payload);
          enc = true;
        } else {
          newState.push(state[i]);
          i++;
        }
      }
      if (!enc) return state.concat(action.payload);
      else return newState;
    }*/ resetItems() {
      return INITIAL_STATE;
    },
  },
});

export const { setItem, resetItems } = itemLinkSlice.actions;

export default itemLinkSlice.reducer;
