import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {nanoid } from 'nanoid';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from "../../redux/selectors";
import {saveChanges, changeDayCard} from '../../redux/slice';
import { IDay, IItem } from "../../interfaces/interfaces";
import AddInput from "../AddInput";
import s from "./Example.module.scss";



const Example =()=>{
    const daysCards=useAppSelector(allSelectors.getDaysCards);
    const [allDays, setAllDays] = useState<IDay[]>(
        [{id:1, items:[{id:'qerqewr',title: 'some', labels:[]}], holidays:null}, {id:2, items:[], holidays:null}, {id:3, items:[], holidays:null}, {id:4, items:[], holidays:null}, {id:5, items:[], holidays:null}]
    );
    const [currentItem, setCurrentItem] = useState<IItem | null>(null);
    const [currentDay, setCurrentDay] = useState<IDay | null>(null);

    const dispatch = useAppDispatch();

    const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'San'];

    

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>, day: IDay, item: IItem): void {
        console.log('drag', item);
        setCurrentItem(item);
        setCurrentDay(day); 
    }

    function dragEndHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.currentTarget.style.background = 'white';
        console.log('end of drag')
    }

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.currentTarget.style.background = 'lightgray'
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>, day: IDay, item: IItem): void {
        e.preventDefault();
        // console.log('drop on item', e.target)
        e.currentTarget.style.background = "white"
    }

    function dragLeaveHandler(e:React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'white'
    }

    function dropOnBoardHandler(e:React.DragEvent<HTMLDivElement>, day: IDay) {
        const onDropItemId = (e.target as HTMLDivElement).id;
        console.log('drop on board', onDropItemId)

        if(currentItem && currentDay) {
            const newCurrentItems = currentDay.items.filter((item)=>{ 
                return item.id !== currentItem.id;
            });
            const dayToRecord = {...day, items: [...day.items]};
            if(currentDay.id === day.id) {
                dayToRecord.items = newCurrentItems;
            }
            const dropIndex = dayToRecord.items.findIndex((elem: IItem)=> elem.id === onDropItemId);
            dayToRecord.items.splice(dropIndex+1, 0, currentItem);
        
            const newDaysWithItems = allDays ? allDays.map(b => {
                if(b.id === day.id) {
                    return dayToRecord;
                }
                if(b.id === currentDay?.id) {
                    return {...currentDay, items: newCurrentItems};
                }
                return b;     
            }) : undefined;

            // setAllDays(newDaysWithItems);
            
            e.currentTarget.style.background = 'white';
        }
    }

    function dropOnBoardHandler2(e:React.DragEvent<HTMLDivElement>, day: IDay) {
        console.log('drop on board', )
        const onDropItemId = (e.target as HTMLDivElement).id;
        if(currentItem && currentDay) {
            const currentIndex = currentDay.items.findIndex((elem)=>elem.id === currentItem.id);
            currentDay?.items.splice(currentIndex, 1);
            const dropIndex = day.items.findIndex(elem=> elem.id === onDropItemId);
            day.items.splice(dropIndex+1, 0, currentItem);
            
        }

        setAllDays(allDays.map(b => {
            console.log('set after drop')

            if(b.id === day.id) {
                console.log('return board')
                return day;
            }
            if(b.id === currentDay?.id) {
                console.log('return currentBoard')

                return currentDay;
            }
            return b;     
        }))
        e.currentTarget.style.background = 'white'
    }

    // useEffect(()=>{
    //     if(daysCards) {
    //        console.log('set useeffect');
    //        const newArr = daysCards.map(({id, items, holidays})=>({id, items: [...items], holidays}))
    //     setAllDays(newArr); 
    //     }
    // }, [daysCards])
    // useEffect(()=>{
    //     dispatch(changeDayCard(allDays));
    //     dispatch(saveChanges())
    // }, [allDays]);

    return (
        <div className={s.example2}>
                {allDays.map(dayCard => {
                const {id, items, holidays} = dayCard;
                if(id === 0) {
                    return (
                        <div className={s.day} key={nanoid()}>  
                        </div>
                    )
                }
                return (
                <div key={id} className={s.day}
                    onDragOver={dragOverHandler}
                    onDrop={(e)=>dropOnBoardHandler2(e, dayCard)}
                    onDragLeave={dragLeaveHandler}
                >
                    <div className={s.day_title}>{id}</div>
                    {/* <AddInput cardId={id}/> */}
                    {items.map((item, index)=>
                        <div key={nanoid()} id={`${item.id}`}
                            onDragOver={dragOverHandler}
                            onDragLeave={dragLeaveHandler}
                            onDragStart={(e)=>dragStartHandler(e, dayCard, item)}
                            onDragEnd={dragEndHandler}
                            onDrop={(e)=>dropHandler(e, dayCard, item)}
                            draggable={true}
                            className={s.item_on_card}
                        >
                            {item.title}
                        </div>)}
                </div>)
            })}
        </div>
        // <div className={s.calendar_grid}>
        //     {daysCards && daysCards.map(dayCard => {
        //         const {id, items, holidays} = dayCard;
        //         if(id === 0) {
        //             return (
        //                 <div className={s.calendar_day} key={nanoid()}>
                            
        //                 </div>
        //             )
        //         }
        //         return (
        //         <div key={id} className={s.calendar_day}
        //             onDragOver={dragOverHandler}
        //             onDrop={(e)=>dropOnBoardHandler(e, dayCard)}
        //             onDragLeave={dragLeaveHandler}
        //         >
        //             <div className={s.day_title}>{id}</div>
        //             <AddInput cardId={id}/>
        //             {items.map((item, index)=>
        //                 <div key={nanoid()} id={`${item.id}`}
        //                     onDragStart={(e)=>dragStartHandler(e, dayCard, item)}
        //                     onDragOver={dragOverHandler}
        //                     onDragLeave={dragLeaveHandler}
        //                     onDragEnd={dragEndHandler}
        //                     onDrop={(e)=>dropHandler(e, dayCard, item)}
        //                     draggable={true}
        //                     className={s.item_on_card}
        //                 >
        //                     {item.title}
        //                 </div>)}
        //         </div>)
        //     })}
        // </div>
    )
}

export default Example;