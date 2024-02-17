import { configureStore, combineReducers } from "@reduxjs/toolkit";
import reducer from "./slice";
import { IYear, IMonth } from "../interfaces/interfaces";

function getDaysInMonth(month: number, year: number) {
  // Первый день месяца с номером 0 - последний день предыдущего месяца
  return new Date(year, month + 1, 0).getDate();
}
function createYearCalendar(year: number) {
  const months = [];
  for (let month = 0; month < 12; month++) {
      const daysInMonth = getDaysInMonth(month, year);
      const monthObj: IMonth = {
          id: month + 1,
          days: []
      };
      for (let day: number = 1; day <= daysInMonth; day++) {
          monthObj.days.push({
              id: day,
              items: [],
              holidays: ''
          });
      }
      months.push(monthObj);
  }
  return {
          yearNumber: year,
          months,
          country: null
      };
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
// const currentMonthIndex = currentDate.getMonth() +1;

const saveToLocalStorage = (data: IYear[] | undefined) => {
  try {
    localStorage.setItem('calendar_data', JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const dataStr = localStorage.getItem('calendar_data');
    return dataStr ? JSON.parse(dataStr) : [createYearCalendar(currentYear)];
  } catch (e) {
    console.error(e);
    return null;
  }
};

const persistedStore = loadFromLocalStorage();

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