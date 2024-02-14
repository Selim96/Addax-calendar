import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import  {IState, IMonth, IDay} from "../interfaces/interfaces";
// import { NewsAPI } from "../services/api";

const initialState: IState = {
    yearNum: 0,
    month: 1,
    daysCards: undefined,
    yearData: undefined,
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
        addDefaultYearData: (state, action: PayloadAction<number>) => {
            // state.yearData = [createYearCalendar(action.payload)];
        },
        changeMonth: (state , action: PayloadAction<number>) => {
            state.month = action.payload;
            if(state.yearData) {
                const selectedDays = state.yearData.find(({yearNumber})=>yearNumber===state.yearNum)?.months.find(({id})=>id===action.payload)?.days;
            
                const date = new Date(`${action.payload}.${1}.${state.yearNum}`); // Создаем объект Date для текущей даты
                const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // 1-7
                const emptyDays = Array.from({ length: dayOfWeek - 1 }, () => ({id:0, items:[], holidays: null}));
                const fullMonth = [...emptyDays, ...selectedDays !== undefined ? selectedDays : []];
            
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

export const {addDefaultYearData, changeYear, changeMonth, saveChanges, changeDayCard, filterNews } = calendarSlice.actions;
export default reducer;