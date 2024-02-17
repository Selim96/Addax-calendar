import React from "react";
import s from './Download.module.scss';
import { useAppSelector } from "../../redux/hooks";
import allSelectors from "../../redux/selectors";

const Download =()=> {

    const yearData = useAppSelector(allSelectors.getYearData);

    const blobConfig = new Blob(
        [JSON.stringify(yearData)], 
        { type: 'text/json;charset=utf-8' }
    )

    const blobUrl = URL.createObjectURL(blobConfig);

    return (
        <div className={s.download_wrap}>
            <a className={s.link} href={blobUrl} download={"calendar.txt"}>Download Calendar</a>
        </div>
        
    )
}

export default Download;