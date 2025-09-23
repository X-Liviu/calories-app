import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import weekReducer from "./reducers/weekReducer";
import myAlimentReducer from "./reducers/myAlimentReducer";
import itemLinkReducer from "./reducers/itemLinkReducer";
const store = configureStore({
  reducer: {
    user: userReducer,
    weeks: weekReducer,
    myAliments: myAlimentReducer,
    itemLinks: itemLinkReducer,
  },
});

export default store;
