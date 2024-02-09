import { createAsyncThunk } from "@reduxjs/toolkit";
import {IArticle} from '../interfaces/interfaces';

interface IResults {
    count: number;
    next: string;
    previous: string | null;
    results: IArticle[];
}

// https://api.spaceflightnewsapi.net/v3/articles
const str ='https://api.spaceflightnewsapi.net/v4/articles/?limit=10&offset=0&summary_contains_one=%2C+&title_contains_one=nasa%2C%20space'

export class NewsAPI {
    private baseURL = 'https://api.spaceflightnewsapi.net/v4';
    private newsEndPoint = '/articles';
    private blogsEndPoint = '/blogs';
    private reportsEndPoint = '/reports'
    private limit = 10;
    private page = 0;
    private wordInSummery = "";
    private wordInTitle = "";

    private articleId: string | undefined = '';

    private allNews = createAsyncThunk<IResults, undefined, {rejectValue: any}>(
        "allNews",
        async (_, { rejectWithValue }) => {
            const response = await fetch(`${this.baseURL}${this.newsEndPoint}/?limit=${this.limit}&offset=${this.limit * this.page}&summary_contains_one=${this.wordInSummery}&title_contains_one=${this.wordInTitle}`);
            
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            const news =await response.json();
            return news;
        }
    );

    public async fetchingNews() {
        const response = await fetch(`${this.baseURL}?limit=${this.limit}&offset=${this.limit * this.page}&summary_contains_one=${this.wordInSummery}&title_contains_one=${this.wordInTitle}`);
        if (!response.ok) {
                throw Error('Server Error!');
            }
            return await response.json();
    }

    private detailsNews = createAsyncThunk<IArticle, undefined, {rejectValue: any}>(
        "detailNews",
        async (_, { rejectWithValue }) => {
            const response = await fetch(`${this.baseURL}${this.newsEndPoint}/${this.articleId}`);

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            const news =await response.json();
            return news;
        }
    );

    getBlogs = createAsyncThunk(
        "blogs",
        async (_, { rejectWithValue }) => {
            const response = await fetch(`${this.baseURL}${this.blogsEndPoint}`);

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            const blogs =await response.json();
            return blogs;
        }
    );

    private nextPage = createAsyncThunk<IResults, undefined, {rejectValue: any}>(
        "nextPage",
        async (_, { rejectWithValue }) => {
            const response = await fetch(`${this.baseURL}?limit=${this.limit}&offset=${this.limit * this.page}&summary_contains_one=${this.wordInSummery}&title_contains_one=${this.wordInTitle}`);
            // console.log(await response.json())
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            const news =await response.json();
            return news;
        }
    );


    public AllNews() {
        return this.allNews;
    };
    public AllNewsResult() {
        return this.allNews();
    };

    public onLoadMore() {
        this.increasePage();
        return this.allNews;
    };
    public onLoadMoreResult() {
        return this.allNews();
    };

    public DetailsNews() {
        return this.detailsNews;
    };
    public DetailsNewsResult() {
        return this.detailsNews();
    }

    public getArticleId() {
        return this.articleId;
    }
    public setArticleId(id: string | undefined) {
        this.articleId = id;
    };

    public getBaseURL() {
        return this.baseURL;
    };
    public setBaseURL(url: string) {
        this.baseURL = url;
    };

    public getLimit() {
        return this.limit;
    };
    public setLimit(num: number) {
        this.limit = num;
    };

    public setWordsToFilter(string: string) {
        const finalString = string.replace(/\s{1,}/g, "%2C%20");
        this.wordInSummery = finalString;
        this.wordInTitle = finalString;
    };

    public getPage() {
        return this.page;
    };
    public resetPage() {
        this.page = 0;
    };

    public increasePage() {
        this.page += 1;
    };
    public decreasePage() {
        this.page = this.page - 1;
        
    };
}
