import  {IState} from "../interfaces/interfaces";

const getYearNum = (state: IState) => state.yearNum;
const getMonthNum = (state: IState) => state.month;
const getDaysCards = (state: IState) => state.daysCards;
const getYearData = (state: IState) => state.yearData;
const getFilter = (state: IState) => state.filterWords;
const getError = (state:IState) => state.error;
const getLoading = (state: IState) => state.loading;

const allSelectors = {
    getYearNum,
    getMonthNum,
    getDaysCards,
    getYearData,
    getFilter,
    getError,
    getLoading
}

export default allSelectors;