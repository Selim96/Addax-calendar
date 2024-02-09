import  {IArticle, IState} from "../interfaces/interfaces";

const getAllNews = (state: IState) => state.allNews;
const getCount = (state: IState) => state.count;
const getNextPage = (state: IState) => state.nextPage;
const getFilter = (state: IState) => state.filterWords;
const getDetails = (state: IState) => state.newsDetails;
const getError = (state:IState) => state.error;
const getLoading = (state: IState) => state.loading;
const getModal = (state: IState) => state.modalIsOpen;
const getIsFetching = (state: IState) => state.isFetching;
const getIsMenuClicked = (state: IState) => state.isMenuClicked;

const allSelectors = {
    getAllNews,
    getCount,
    getNextPage,
    getFilter,
    getDetails,
    getError,
    getLoading,
    getModal,
    getIsFetching,
    getIsMenuClicked
}

export default allSelectors;