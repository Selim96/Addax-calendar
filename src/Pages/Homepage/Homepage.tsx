import React, { ReactHTML, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import allSelectors from '../../redux/selectors';
import Container from "../../components/Container";
import s from './Homepage.module.scss';

interface ICard {
    id: number; order: number; text: string;
}

interface IItem {
    id: number,
    title: string
}

interface IBoard {
    id: number,
    title: string,
    items: IItem[]
}

const Homepage: React.FC = () => {
    const [boards, setBoards] = useState<IBoard[]>([
        {id:1, title: "TODO", items: [{id:1, title: 'go to shop'}, {id:2,title:'write artical'}, {id: 3, title:'read book'}]},
        {id:2, title: "InProgress", items: [{id:4, title: 'learn JS'}, {id:5,title:'learn Node'}, {id: 6, title:'check car'}]},
        {id:3, title: "Done", items: [{id:7, title: 'sleep'}, {id:8,title:'eat'}, {id:9, title:'cook'}]}
    ]);
    const [currentCard, setCurrentCard] = useState<IItem | null>(null);
    const [currentBoard, setCurrentBoard] = useState<IBoard | null>(null);


    function dragStartHandler(e: React.DragEvent<HTMLDivElement>, board: IBoard, item: IItem): void {
        console.log('drag', item);
        setCurrentCard(item);
        setCurrentBoard(board);
    }

    function dragEndHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.currentTarget.style.background = 'white'
    }

    function dragOverHander(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.currentTarget.style.background = 'lightgray'
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>, board: IBoard, item: IItem): void {
        e.preventDefault();
        console.log('drop on item', e.target)
        // if(currentCard && currentBoard) {
        //     const currentIndex = currentBoard.items.indexOf(currentCard);
        //     currentBoard?.items.splice(currentIndex, 1);
        //     const dropIndex = board.items.indexOf(item);
        //     board.items.splice(dropIndex, 0, currentCard);
        // }
        // setBoards(boards.map(b => {
        //         if(b.id === board.id) {
        //             return board;
        //         }
        //         if(b.id === currentBoard?.id) {
        //             return currentBoard;
        //         }
        //     return b;     
        // }))
        e.currentTarget.style.background = "white"
    }

    function dragLeaveHandler(e:React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'white'
    }

    function dropOnBoardHandler(e:React.DragEvent<HTMLDivElement>, board: IBoard) {
        console.log('drop on board', )
        
        const onDropItemId = Number((e.target as HTMLDivElement).id);
        console.log(onDropItemId)
        if(currentCard && currentBoard) {
            const currentIndex = currentBoard.items.indexOf(currentCard);
            currentBoard?.items.splice(currentIndex, 1);
            const dropIndex = board.items.findIndex(elem=> elem.id === onDropItemId);
            board.items.splice(dropIndex+1, 0, currentCard);
            
        }
        setBoards(boards.map(b => {
            if(b.id === board.id) {
                return board;
            }
            if(b.id === currentBoard?.id) {
                return currentBoard;
            }
            return b;     
        }))
        e.currentTarget.style.background = 'white'
    }

    return (
        <Container>
            <main className={s.mainBox}>
                <h1 className={s.title} id="title">Calendar</h1>
                <div className={s.card_list}>
                    {boards.map(board=>
                        <div key={board.id} className={s.board}
                            onDragOver={dragOverHander}
                            onDrop={(e)=>dropOnBoardHandler(e, board)}
                            onDragLeave={dragLeaveHandler}
                        >
                            <div className={s.board_title}>{board.title}</div>
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
                        </div>)}
                </div>
                
                
            </main>
        </Container>)
}

export default Homepage;
