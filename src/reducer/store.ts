import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./languageSlice";
import translateReducer from "./translateSlice";
import statusReducer from "./statusSlice";
import loginReducer from "./loginSlice";

const store = configureStore({
  reducer: {
    language: languageReducer,
    translate: translateReducer,
    status: statusReducer,
    login: loginReducer,
  },
});

export default store;
