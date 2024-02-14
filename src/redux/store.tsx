import { configureStore, combineReducers } from "@reduxjs/toolkit";
import reducer from "./slice";
import { IYear } from "../interfaces/interfaces";

const saveToLocalStorage = (data: IYear[] | null) => {
  try {
    localStorage.setItem('calendar_data', JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const dataStr = localStorage.getItem('calendar_data');
    return dataStr ? JSON.parse(dataStr) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const persistedStore = loadFromLocalStorage() || [];

export const store = configureStore({
  reducer,
  preloadedState: {
    yearData: persistedStore
  },
});

store.subscribe(() => {
  saveToLocalStorage(store.getState().yearData)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;