import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/reducers/userReducer";
import weekReducer from "./redux/reducers/weekReducer";
import myAlimentReducer from "./redux/reducers/myAlimentReducer";
import itemLinkReducer from "./redux/reducers/itemLinkReducer";
import yearReducer from "./redux/reducers/yearReducer";
import uiReducer from "./redux/reducers/uiReducer";
const store = configureStore({
  reducer: {
    user: userReducer,
    weeks: weekReducer,
    myAliments: myAlimentReducer,
    itemLinks: itemLinkReducer,
    year: yearReducer,
    ui: uiReducer,
  },
});

export default store;
