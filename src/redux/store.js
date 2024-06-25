import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";
import reducer from "./reducer";

export const store = configureStore({
  reducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
