import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import idReducer from "./id";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import colorReducer from "./colorscheme";
import userReducer from "./user";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === "undefined" ? createNoopStorage() : createWebStorage();

const colorConfig = {
  key: "color",
  storage,
};

const userConfig = {
  key: "user",
  storage,
};

const idConfig = {
  key: "id",
  storage,
};

const reducer = combineReducers({
  color: persistReducer(colorConfig, colorReducer),
  user: persistReducer(userConfig, userReducer),
  id: persistReducer(idConfig, idReducer),
});

export default reducer;
