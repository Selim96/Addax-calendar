import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import  {IState, IMonth, IDay} from "../interfaces/interfaces";
import { HolidayAPI } from "../services/api";

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

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        changeYear: (state , action: PayloadAction<number>) => {
            state.yearNum = action.payload;
        },
        addDefaultYearData: (state, action: PayloadAction<number>) => {
            // state.yearData = [createYearCalendar(action.payload)];
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
                    const {months} = year;
                    const newMonths=months.map((month)=>{
                        if(month.id === state.month && changedDays) {
                            return {...month, days: [...changedDays]}
                        }
                        return month;
                    })
                    const newYear = {...year, months: newMonths}
                    return newYear;
                })];
                state.yearData = [...newYearData];
            }
        },
        changeDayCard: (state, action)=>{
            state.daysCards=action.payload;
        },

        resetAllNews: (state) => {
            // state.allNews = [];
        },
        filterNews: (state, action: PayloadAction<string>) => {
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
                console.log(action.payload);
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
                        if(holidaysCollection.has(month.id)) {
                            const holiday = holidaysCollection.get(month.id);
                            if(holiday) {
                                const date = new Date(holiday?.date);
                                const holidayDay = date.getDate();
                                const newDays = month.days.map(day=>{
                                    if(holidayDay === day.id) {
                                        return {...day, holidays: `${holiday.localName}`}
                                    }
                                    return day;
                                })
                                return {...month, days: newDays}
                            }
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
                toast.error("Fatal error");
            }
        });
        
    }
});

const reducer = calendarSlice.reducer;

export const {addDefaultYearData, changeYear, changeMonth, saveChanges, changeDayCard, filterNews } = calendarSlice.actions;
export default reducer;