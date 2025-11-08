import { createSlice } from "@reduxjs/toolkit";

//Se obtiene del localStorage, el since. Lo hago de esta manera puesto que no puedo usar useSelector, ya que esto no es un componente de React.
/**const initialYear =
  JSON.parse(localStorage.getItem("token"))?.since || new Date().getFullYear(); */

const INITIAL_STATE = {
  currentYear: 2030,
  lastSavedYear: 2030,
};

const yearSlice = createSlice({
  name: "year",
  initialState: INITIAL_STATE,
  reducers: {
    setYear(state, action) {
      state.lastSavedYear = action.payload;
    },
  },
});

export const { setYear } = yearSlice.actions;
export default yearSlice.reducer;
