export interface IArticle {
    id: number;
    title: string;
    url: string;
    image_url: string | null;
    news_site: string;
    summary: string;
    published_at: string;
    updated_at: string;
    featured: boolean;
    launches: ({
            id: string;
            provider: string;
        } | null)[];
    events: ({
            id: number | string;
            provider: string;
        } | null)[];
};

export interface IBlog {
        id: 0,
        title: string,
        url: string,
        image_url: string,
        news_site: string,
        summary: string,
        published_at: typeof Date,
        updated_at: typeof Date,
        featured: boolean,
        launches: 
          {
            launch_id: string,
            provider: string
          }[] | []
        ,
        "events": 
          {
            event_id: number,
            provider: string
          }[] | []
        
}

export interface IState {
    allNews: IArticle[];
    blogs: IBlog[];
    nextPage: string | null;
    count: number;
    filterWords: string;
    newsDetails: IArticle | null;
    error: any;
    loading: boolean;
    modalIsOpen: boolean;
    isFetching: boolean;
    isMenuClicked: boolean;
};