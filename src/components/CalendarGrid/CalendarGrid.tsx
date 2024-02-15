import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {nanoid } from 'nanoid'
import s from './CalendarGrid.module.scss';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from "../../redux/selectors";
import {saveChanges, changeDayCard} from '../../redux/slice';
import { IDay, IItem } from "../../interfaces/interfaces";
import AddInput from "../AddInput";

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
    height: 150,
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


const CalendarGrid = () => {
    const [currentItem, setCurrentItem] = useState<IItem | null>(null);
    const [currentDay, setCurrentDay] = useState<IDay | null>(null);

    const dispatch = useAppDispatch();

    const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'San'];

    const daysCards=useAppSelector(allSelectors.getDaysCards);

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>, day: IDay, item: IItem): void {
        console.log('drag', item);
        setCurrentItem(item);
        setCurrentDay(day);
    }

    function dragEndHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.currentTarget.style.background = 'white'
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
        
            const newDaysWithItems = daysCards ? daysCards.map(b => {
                if(b.id === day.id) {
                    return dayToRecord;
                }
                if(b.id === currentDay?.id) {
                    return {...currentDay, items: newCurrentItems};
                }
                return b;     
            }) : undefined;

            dispatch(changeDayCard(newDaysWithItems));
            dispatch(saveChanges())
            e.currentTarget.style.background = 'white';
        }
    }

    useEffect(()=>{
        return ()=>{dispatch(saveChanges())}
    }, [])
   

    return (
        <div>
            
            <ThemeProvider theme={theme}>
                <Grid container rowSpacing={1} columnSpacing={[0, 0, 1, 1]} >
                    {weekDaysNames.map(day=>{
                        return (
                            <Grid item xs={1.7} md={1.7} lg={1.7} key={nanoid()}>
                                <Item className={s.days_name}>
                                    <div>
                                        {day}
                                    </div>
                                </Item>
                            </Grid>
                        )
                    })}
                    {daysCards && daysCards.map((dayCard) => {
                        const {id, items, holidays} = dayCard;
                        if(id === 0) {
                            return (
                                <Grid item xs={1.7} md={1.7} lg={1.7} key={nanoid()}>
                                <Item className={s.itemClass}>
                                    <div key={nanoid()} className={s.empty_card}>
                                    </div>
                                </Item>
                            </Grid>
                            )
                        }
                        return (
                            <Grid item xs={1.7} md={1.7} lg={1.7} key={nanoid()}>
                                <Item className={s.itemClass}>
                                    <div key={id} className={s.day_card}
                                        onDragOver={dragOverHandler}
                                        onDrop={(e)=>dropOnBoardHandler(e, dayCard)}
                                        onDragLeave={dragLeaveHandler}
                                    >
                                        <div className={s.day_title}>{id}</div>
                                        <AddInput cardId={id}/>
                                        {items.map((item, index)=>
                                            <div key={nanoid()} id={`${item.id}`}
                                                onDragStart={(e)=>dragStartHandler(e, dayCard, item)}
                                                onDragOver={dragOverHandler}
                                                onDragLeave={dragLeaveHandler}
                                                onDragEnd={dragEndHandler}
                                                onDrop={(e)=>dropHandler(e, dayCard, item)}
                                                draggable={true}
                                                className={s.item_on_card}
                                            >
                                                {item.title}
                                            </div>)}
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