import { createAsyncThunk } from "@reduxjs/toolkit";
// import {IArticle} from '../interfaces/interfaces';

// interface IResults {
//     count: number;
//     next: string;
//     previous: string | null;
//     results: IArticle[];
// }

// {
//     "countryCode": "UA",
//     "name": "Ukraine"
//   },


export class HolidayAPI {
    private baseURL = 'https://date.nager.at/api/v3';
    private publicHolidays = 'PublicHolidays';
    private country = 'ua';


    getPublicHolidays = createAsyncThunk<any, number, {rejectValue: any}>(
        "publicHolidays",
        async (year: number, { rejectWithValue }) => {
            const response = await fetch(`${this.baseURL}/${this.publicHolidays}/${year}/${this.country}`);
            
            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            const holidays =await response.json();
            return holidays;
        }
    );

}
