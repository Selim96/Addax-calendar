import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {nanoid } from 'nanoid'
import s from './CalendarGrid.module.scss';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    borderRadius: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 400,
    // height: 530,
}));

const theme = createTheme({
    breakpoints: {
    values: {
        xs: 0,
        sm: 480,
        md: 860,
        lg: 1440,
        xl: 1536,
    },
  }
});

interface IMonth {
    month: number,
    days: number[]
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
            month: month + 1,
            days: []
        };
        for (let day: number = 1; day <= daysInMonth; day++) {
            monthObj.days.push(day);
        }
        months.push(monthObj);
    }
    return months;
}

const yearNum = 2024; // Задайте нужный год
const yearCalendar = createYearCalendar(yearNum);

const CalendarGrid = () => {
    const [year, setYear] = useState<IMonth[]>(yearCalendar);
    const [month, setMonth] = useState<number[]>([]);
    const [monthNum, setMonthNum] = useState<number>(1);

    const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'San'];

    const onChangeMonthNum = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setMonthNum(value);
    }

    useEffect(()=> {
        const currentMonth = year.find(({month})=> month === monthNum);
        const date = new Date(`${currentMonth?.month}.${1}.${yearNum}`); // Создаем объект Date для текущей даты
        const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
        
        if(currentMonth) {
            const emptyDays = Array.from({ length: dayOfWeek - 1 }, () => 0);
            const fullMonth = [...emptyDays, ...currentMonth.days];
        
            setMonth(fullMonth)
        }
    }, [monthNum]);

    return (
        <div>
            <div className={s.select_month}>
                <select value={monthNum} onChange={onChangeMonthNum}>
                    {year.map(({month}) => <option key={month} value={month}>{month}</option>)}
                </select>
            </div>
            <ThemeProvider theme={theme}>
                <Grid container rowSpacing={1} columnSpacing={[0, 0, 1, 1]} >
                    {weekDaysNames.map(day=>{
                        return (
                            <Grid item xs={1.7} md={1.7} lg={1.7} key={nanoid()}>
                                <Item className={s.itemClass}>
                                    <div>
                                        {day}
                                    </div>
                                </Item>
                            </Grid>
                        )
                    })}
                    {month.map((item) => {
                        return (
                            <Grid item xs={1.7} md={1.7} lg={1.7} key={nanoid()}>
                                <Item className={s.itemClass}>
                                    <div>
                                        {item}
                                    </div>
                                </Item>
                            </Grid>
                        )
                    })}
                </Grid>
            </ThemeProvider>
        </div>
    )
}

export default CalendarGrid;