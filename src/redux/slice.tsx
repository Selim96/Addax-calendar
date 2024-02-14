import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import  {IState, IMonth, IDay} from "../interfaces/interfaces";
// import { NewsAPI } from "../services/api";

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
                holidays: null
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
const currentMonthIndex = currentDate.getMonth() +1;

localStorage.setItem('calendar_data', JSON.stringify([createYearCalendar(currentYear)]))

const initialState: IState = {
    yearNum: 0,
    month: 1,
    daysCards: createYearCalendar(currentYear).months.find(({id})=>id===currentMonthIndex)?.days,
    yearData: [createYearCalendar(currentYear)],
    filterWords: '',
    error: null,
    loading: false,
}

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        changeYear: (state , action: PayloadAction<number>) => {
            state.yearNum = action.payload;
        },
        changeMonth: (state , action: PayloadAction<number>) => {
            state.month = action.payload;

            const selectedDays = state.yearData.find(({yearNumber})=>yearNumber===state.yearNum)?.months.find(({id})=>id===action.payload)?.days;
            
            const date = new Date(`${action.payload}.${1}.${state.yearNum}`); // Создаем объект Date для текущей даты
            const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // 1-7
            const emptyDays = Array.from({ length: dayOfWeek - 1 }, () => ({id:0, items:[], holidays: null}));
            const fullMonth = [...emptyDays, ...selectedDays !== undefined ? selectedDays : []];
        
            state.daysCards = fullMonth;
        },
        saveChanges: (state) => {
            if(state.daysCards) {
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
        // builder.addCase(allNews.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // });
        // builder.addCase(allNews.fulfilled, (state: IState, { payload }) => {
        //         state.loading = false;
        //         state.allNews.push(...payload.results);
        //         state.nextPage = payload.next;
        //         state.count = payload.count;
        //         state.isFetching = false;
        // });
        // builder.addCase(allNews.rejected, (state, { payload }) => {
        //     state.loading = false;
        //     state.error = payload;
        //     if (payload) {
        //         toast.error("Fatal error");
        //     }
        // });
        
    }
});

const reducer = calendarSlice.reducer;

export const {changeYear, changeMonth, saveChanges, changeDayCard, filterNews } = calendarSlice.actions;
export default reducer;