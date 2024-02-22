import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from '../../redux/selectors';
import s from './Homepage.module.scss';
import { IDay, IItem } from "../../interfaces/interfaces";
import AddInput from "../../components/AddInput";
import Item from "../../components/Item";
import { nanoid } from "nanoid";
import { changeDayCard, saveChanges } from "../../redux/slice";


const Homepage: React.FC = () => {
    const [currentCard, setCurrentCard] = useState<IItem | null>(null);
    const [currentBoard, setCurrentBoard] = useState<IDay | null>(null);
    const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'San'];

    const daysCards=useAppSelector(allSelectors.getDaysCards);
    const currentMonth = useAppSelector(allSelectors.getMonthNum);

    const dispatch = useAppDispatch();

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>, day: IDay, item: IItem): void {
        setCurrentCard({...item});
        setCurrentBoard({...day, items: [...day.items]});
    }

    function dragEndHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.currentTarget.style.boxShadow = 'none';
        // e.currentTarget.style.border = 'none';
    }

    function dragOverHander(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.currentTarget.style.boxShadow = '0px 0px 5px 0px rgba(81, 182, 223, 0.734)';
        // e.currentTarget.style.border = '1px solid ';
    }
    function dragOverHanderItem(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.currentTarget.style.boxShadow = '0px 6px 5px 0px rgba(0,0,0,0.56)';
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.currentTarget.style.boxShadow = 'none';
    }

    function dragLeaveHandler(e:React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.boxShadow = 'none';
        // e.currentTarget.style.border = 'none';
    }

    function dropOnBoardHandler(e:React.DragEvent<HTMLDivElement>, day: IDay) {
        const onDropItemId = (e.target as HTMLDivElement).id;
        if(currentCard && currentBoard && daysCards) {
            const newItems = day.items.filter(item=>item.id !== currentCard.id);
            const newDay = {...day, items: newItems}

            const currentIndex = currentBoard.items.findIndex(item=>item.id=== currentCard.id);
            currentBoard?.items.splice(currentIndex, 1);
            const dropIndex = newDay.items.findIndex(elem=> elem.id === onDropItemId);
            newDay.items.splice(dropIndex+1, 0, currentCard);
        
            const newAllDays = daysCards.map(b => {
                if(b.id === newDay.id) {
                    return newDay;
                }
                if(b.id === currentBoard?.id) {
                    return currentBoard;
                }
                return b;     
            });
            
            dispatch(changeDayCard(newAllDays));
            dispatch(saveChanges());
            e.currentTarget.style.scale = '1';
            // e.currentTarget.style.border = 'none';
            e.currentTarget.style.boxShadow = 'none';
        }
    }

    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth() +1;
    const currentDay = currentDate.getDate();

    const regularDayClass = currentMonthIndex === currentMonth;

    return (
            <main className={s.mainBox}>
                <div className={s.weekdays_box}>
                    {weekDaysNames.map(dayName=>
                    <div className={s.weekdays_name}>
                        {dayName}
                    </div>)}
                </div>
                <div className={s.card_list}>
                    {daysCards && daysCards.map(board=>{
                        if(board.id === 0) {
                            return (
                                <div key={nanoid()} className={`${s.board} ${s.empty_board} `}>
                                </div>
                            )
                        }
                        
                        return (
                        <div key={board.id} className={`${s.board} ${board.id === currentDay && regularDayClass ? s.todayClass : ''}`} style={board.holidays !== '' ? {backgroundColor: "hsl(11deg 74.85% 81.8%)"} : {}}
                        
                            onDragOver={dragOverHander}
                            onDrop={(e)=>dropOnBoardHandler(e, board)}
                            onDragLeave={dragLeaveHandler}
                        >
                            <div className={s.board_title}>
                                <p>{board.id}</p>
                                {board.holidays !== '' && <span>{board.holidays}</span>}
                            </div>
                            <AddInput cardId={board.id}/>
                                <div className={s.list_items}>
                                    {board.items.map(item=>
                                        <Item 
                                            item={item}
                                            day={board}
                                            onDragOver={dragOverHanderItem}
                                            onDragLeave={dragLeaveHandler}
                                            onDragStart={dragStartHandler}
                                            onDragEnd={dragEndHandler}
                                            onDrop={dropHandler}
                                        />
                                    )}
                                </div>
                        </div>)})}
                </div> 
            </main>
    )
}

export default Homepage;





// const [boards, setBoards] = useState<IBoard[]>([
    //     {id:1, title: "TODO", items: [{id:1, title: 'go to shop'}, {id:2,title:'write artical'}, {id: 3, title:'read book'}]},
    //     {id:2, title: "InProgress", items: [{id:4, title: 'learn JS'}, {id:5,title:'learn Node'}, {id: 6, title:'check car'}]},
    //     {id:3, title: "Done", items: [{id:7, title: 'sleep'}, {id:8,title:'eat'}, {id:9, title:'cook'}]}
    // ]);