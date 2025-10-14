import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import weekReducer from "./reducers/weekReducer";
import myAlimentReducer from "./reducers/myAlimentReducer";
import itemLinkReducer from "./reducers/itemLinkReducer";
import globalErrorReducer from "./reducers/globalErrorReducer";
const store = configureStore({
  reducer: {
    user: userReducer,
    weeks: weekReducer,
    myAliments: myAlimentReducer,
    itemLinks: itemLinkReducer,
    globalError: globalErrorReducer,
  },
});

export default store;
