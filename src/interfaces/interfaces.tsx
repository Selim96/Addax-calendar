export interface IItem {
    id: string,
    title: string,
    labels: string[]
}

export interface IDay {
    id: number,
    items:IItem[],
    holidays: string
};

export interface IMonth {
    id: number,
    days: IDay[],        
}

export interface IYear {
  yearNumber: number,
  months: IMonth[],
  country: string | null  
}

export interface IState {
    yearNum: number,
    month: number,
    daysCards: IDay[] | undefined,
    yearData: IYear[] | undefined,
    filterWords: string,
    error: any,
    loading: boolean,
};