import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import weekReducer from "./reducers/weekReducer";
const store = configureStore({
  reducer: {
    user: userReducer,
    weeks: weekReducer,
  },
});

export default store;
