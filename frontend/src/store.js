import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/reducers/userReducer";
import weekReducer from "./redux/reducers/weekReducer";
import myAlimentReducer from "./redux/reducers/myAlimentReducer";
import itemLinkReducer from "./redux/reducers/itemLinkReducer";
import globalErrorReducer from "./redux/reducers/globalErrorReducer";
import yearReducer from "./redux/reducers/yearReducer";
const store = configureStore({
  reducer: {
    user: userReducer,
    weeks: weekReducer,
    myAliments: myAlimentReducer,
    itemLinks: itemLinkReducer,
    globalError: globalErrorReducer,
    year: yearReducer,
  },
});

export default store;
