import { createSlice } from "@reduxjs/toolkit";

const globalErrorSlice = createSlice({
  name: "globalError",
  initialState: null,
  reducers: {
    setError(state, action) {
      return action.payload;
    },
  },
});

export const { setError } = globalErrorSlice.actions;
export default globalErrorSlice.reducer;
