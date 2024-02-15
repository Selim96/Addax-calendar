import React, { ReactHTML, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from '../../redux/selectors';
import s from './Homepage.module.scss';
import { IDay, IItem } from "../../interfaces/interfaces";
import AddInput from "../../components/AddInput";
import { nanoid } from "nanoid";
import { changeDayCard, saveChanges } from "../../redux/slice";


const Homepage: React.FC = () => {
    const [allDays, setAllDays] = useState<IDay[]>(
        [{id:1, items:[{id:'qerqewr',title: 'some', labels:[]}], holidays:null}, {id:2, items:[], holidays:null}, {id:3, items:[], holidays:null}, {id:4, items:[], holidays:null}, {id:5, items:[], holidays:null}]
    );
    const [currentCard, setCurrentCard] = useState<IItem | null>(null);
    const [currentBoard, setCurrentBoard] = useState<IDay | null>(null);
    const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'San'];

    const daysCards=useAppSelector(allSelectors.getDaysCards);

    const dispatch = useAppDispatch();

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>, day: IDay, item: IItem): void {
        console.log('drag', item);
        setCurrentCard({...item});
        setCurrentBoard({...day, items: [...day.items]});
    }

    function dragEndHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.currentTarget.style.background = 'white';
    }

    function dragOverHander(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.currentTarget.style.background = 'lightgray'
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>, board: IDay, item: IItem): void {
        e.preventDefault();
        e.currentTarget.style.background = "white"
    }

    function dragLeaveHandler(e:React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'white'
    }

    function dropOnBoardHandler(e:React.DragEvent<HTMLDivElement>, day: IDay) {
        const onDropItemId = (e.target as HTMLDivElement).id;
        if(currentCard && currentBoard && daysCards) {
            const newItems = day.items.filter(item=>item.id !== currentCard.id);
            const newDay = {...day, items: newItems}

            const currentIndex = currentBoard.items.indexOf(currentCard);
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
            e.currentTarget.style.background = 'white'
        }
    }

    return (
            <main className={s.mainBox}>
                <div className={s.card_list}>
                    {daysCards && daysCards.map(board=>{
                        if(board.id === 0) {
                            return (
                                <div key={nanoid()} className={s.board}>
                                </div>
                            )
                        }
                        return (
                        <div key={board.id} className={s.board}
                            onDragOver={dragOverHander}
                            onDrop={(e)=>dropOnBoardHandler(e, board)}
                            onDragLeave={dragLeaveHandler}
                        >
                            <div className={s.board_title}>{board.id}</div>
                            <AddInput cardId={board.id}/>
                            {board.items.map(item=>
                                <div key={item.id} id={`${item.id}`}
                                    onDragOver={dragOverHander}
                                    onDragLeave={dragLeaveHandler}
                                    onDragStart={(e)=>dragStartHandler(e, board, item)}
                                    onDragEnd={dragEndHandler}
                                    onDrop={(e)=>dropHandler(e, board, item)}
                                    draggable={true}
                                    className={s.item}
                                >{item.title}</div>)}
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