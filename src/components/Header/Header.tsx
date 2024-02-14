import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import s from './Header.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {addDefaultYearData, changeMonth, changeYear, saveChanges} from "../../redux/slice";
import allSelectors from '../../redux/selectors';

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonthIndex = currentDate.getMonth() +1;

const Header: React.FC = () => {
    const [yearNum, setYearNum] = useState<number>(currentYear);
    const [monthNum, setMonthNum] = useState<number>(currentMonthIndex); // 1-12

    const dispatch = useAppDispatch();

    const yearData = useAppSelector(allSelectors.getYearData);

    const onChangeMonthNum = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setMonthNum(value);
    }
    useEffect(()=> {
            dispatch(changeYear(yearNum));
    }, [yearNum]);

    useEffect(()=> {
        dispatch(changeMonth(monthNum));
        // dispatch(saveChanges());
    }, [monthNum]);

    useEffect(()=>{
        
    }, [])

    return <header className={s.header}>
        <Link to={'/'}></Link>
        
        <div className={s.select_month}>
                <select value={monthNum} onChange={onChangeMonthNum}>
                    {months.map((month, index) => <option key={index} value={index +1}>{month}</option>)}
                </select>
        </div>
        <div className={s.month_name}>
            {`${months[monthNum-1]} ${yearNum}`}
        </div>
    </header>
};

export default Header;