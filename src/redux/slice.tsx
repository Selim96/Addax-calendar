import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import  {IState, IMonth, IDay} from "../interfaces/interfaces";
import { HolidayAPI } from "../services/api";
// import { createYearCalendar } from "./store";

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

const holidayAPI = new HolidayAPI();

const initialState: IState = {
    yearNum: 0,
    month: 1,
    daysCards: undefined,
    yearData: undefined,
    filterWords: '',
    error: null,
    loading: false,
}

interface IResponse {
    date: string;
    localName: string;
}

function getDayNum(holiday: string) {
    const date = new Date(holiday);
    const holidayDay = date.getDate();
    return holidayDay;
}

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        changeYear: (state , action: PayloadAction<number>) => {
            state.yearNum = action.payload;
            if(state.yearData) {
                const isYearIn = state.yearData.some(year=> year.yearNumber === action.payload);
                if(!isYearIn) state.yearData = [...state.yearData, createYearCalendar(action.payload)];
            }
        },
        changeMonth: (state , action: PayloadAction<number>) => {
            state.month = action.payload;
            if(state.yearData) {
                const selectedDays = state.yearData.find(({yearNumber})=>yearNumber===state.yearNum)?.months.find(({id})=>id===action.payload)?.days;
            
                const date = new Date(`${action.payload}.${1}.${state.yearNum}`); // Создаем объект Date для текущей даты
                const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // 1-7
                const emptyDays = Array.from({ length: dayOfWeek - 1 }, () => ({id:0, items:[], holidays: ''}));
                const fullMonth = [...emptyDays, ...(selectedDays !== undefined ? selectedDays : [])];
            
                state.daysCards = fullMonth;
            }
        },

        saveChanges: (state) => {
            if(state.daysCards && state.yearData) {
                const changedDays: IDay[] = [];
                state.daysCards.forEach((item)=>{
                    if(item.id === 0){return}
                    changedDays.push(item);
                });
                const newYearData = [...state.yearData.map((year)=>{
                    if(year.yearNumber === state.yearNum) {
                        const {months} = year;
                        const newMonths=months.map((month)=>{
                            if(month.id === state.month && changedDays) {
                                return {...month, days: [...changedDays]}
                            }
                            return month;
                        })
                        const newYear = {...year, months: newMonths}
                        return newYear;
                    }
                    return year;
                })];
                state.yearData = [...newYearData];
            }
        },
        changeDayCard: (state, action)=>{
            state.daysCards=action.payload;
        },

        filterByLabels: (state, action: PayloadAction<string>) => {
            state.filterWords = action.payload;
        },
    },
    extraReducers:(builder) => {
        builder.addCase(holidayAPI.getPublicHolidays.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(holidayAPI.getPublicHolidays.fulfilled, (state: IState, action: PayloadAction<IResponse[]>) => {
                state.loading = false;
                
                const holidaysCollection = new Map<number, IResponse>();
                action.payload.forEach((elem)=>{
                    const dateString = elem.date;
                    const date = new Date(dateString);
                    const month = date.getMonth() + 1;
                    if(holidaysCollection.has(month)) {
                        if(holidaysCollection.has(month+20)) {
                            holidaysCollection.set(month+30, elem);
                            return;
                        }
                        holidaysCollection.set(month+20, elem);
                        return;
                    }
                    holidaysCollection.set(month, elem);
                });
                
                if(state.yearData) {
                    const otherYears = state.yearData.filter(({yearNumber})=>yearNumber!==state.yearNum);
                    const currentYear = state.yearData.find(({yearNumber})=>yearNumber===state.yearNum);
                    const newMonths = currentYear?.months.map((month)=>{
                        if(holidaysCollection.has(month.id) || holidaysCollection.has(month.id+20) || holidaysCollection.has(month.id+30)) {
                            const holiday1 = holidaysCollection.get(month.id);
                            const holiday2 = holidaysCollection.get(month.id+20);
                            const holiday3 = holidaysCollection.get(month.id+30);
                            
                                const holidayDay1 = holiday1 && getDayNum(holiday1?.date);
                                const holidayDay2 = holiday2 && getDayNum(holiday2?.date);
                                const holidayDay3 = holiday3 && getDayNum(holiday3?.date);
                                const newDays = month.days.map(day=>{
                                    if(holidayDay1 === day.id && holiday1) {
                                        return {...day, holidays: `${holiday1.localName}`}
                                    }
                                    if(holidayDay2 === day.id && holiday2) {
                                        return {...day, holidays: `${holiday2.localName}`}
                                    }
                                    if(holidayDay3 === day.id && holiday3) {
                                        return {...day, holidays: `${holiday3.localName}`}
                                    }
                                    return day;
                                })
                                return {...month, days: newDays}
                            
                        }
                        return {...month};
                    });

                    if(currentYear && newMonths) {
                        state.yearData = [...otherYears, {...currentYear, months: newMonths}]
                    }
                    
                }
        });
        builder.addCase(holidayAPI.getPublicHolidays.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
            if (payload) {
                toast.error("Error to load holidays!");
            }
        });
        
    }
});

const reducer = calendarSlice.reducer;

export const { changeYear, changeMonth, saveChanges, changeDayCard, filterByLabels } = calendarSlice.actions;
export default reducer;