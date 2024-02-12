import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
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
console.log(yearCalendar);


const CalendarGrid = () => {
    const [year, setYear] = useState<IMonth[]>(yearCalendar);
    const [month, setMonth] = useState<number[]>([]);
    const [monthNum, setMonthNum] = useState<number>(1);



    const onChangeMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setMonthNum(value);
    }

    useEffect(()=> {
        const curretnMont = year.find(({month})=> month === monthNum);
        if(curretnMont) setMonth(curretnMont.days)
    }, [monthNum])

    return (
        <div>
            <div className={s.select_month}>
                <select value={monthNum} onChange={onChangeMonth}>
                    {year.map(({month}) => <option value={month}>{month}</option>)}
                </select>
            </div>
            <ThemeProvider theme={theme}>
                <Grid container rowSpacing={2} columnSpacing={[0, 0, 2, 6]} >
                    {month.map((item) => {
                        return (
                            <Grid item xs={1.7} md={1.7} lg={1.7} key={item}>
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