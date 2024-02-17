import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import s from './Header.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {addDefaultYearData, changeMonth, changeYear, saveChanges} from "../../redux/slice";
import allSelectors from '../../redux/selectors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { HolidayAPI } from '../../services/api';

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonthIndex = currentDate.getMonth() +1;

const holidayAPI = new HolidayAPI();

const Header: React.FC = () => {
    const [yearNum, setYearNum] = useState<number>(currentYear);
    const [monthNum, setMonthNum] = useState<number>(currentMonthIndex); // 1-12

    const dispatch = useAppDispatch();

    const yearData = useAppSelector(allSelectors.getYearData);

    const onChangeMonthNum = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setMonthNum(value);
    }

    const increaseMonth = () => {
        if(monthNum === 12) return;
        setMonthNum(monthNum +1);
    }
    const decreaseMonth = () => {
        if(monthNum === 1) return;
        setMonthNum(monthNum -1);
    }
    useEffect(()=> {
            dispatch(changeYear(yearNum));
            dispatch(holidayAPI.getPublicHolidays(yearNum));
    }, [yearNum]);

    useEffect(()=> {
        dispatch(changeMonth(monthNum));
        // dispatch(saveChanges());
    }, [monthNum, yearData]);

    useEffect(()=>{
        
    }, [])

    return <header className={s.header}>
        <div className={s.change_buttons}>
            <div className={s.button} onClick={increaseMonth}><KeyboardArrowDownIcon /></div>
            <div className={s.button} onClick={decreaseMonth}><KeyboardArrowUpIcon/></div>
        </div>
        <div className={s.month_name}>
            {`${months[monthNum-1]} ${yearNum}`}
        </div>
        <div className={s.select_month}>
                <select value={monthNum} onChange={onChangeMonthNum} className={s.selector}>
                    {months.map((month, index) => <option key={index} value={index +1}>{month}</option>)}
                </select>
        </div>
        
    </header>
};

export default Header;