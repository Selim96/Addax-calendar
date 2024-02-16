import React from "react";
import s from './Item.module.scss';
import { IDay, IItem } from "../../interfaces/interfaces";

interface Interface {
    item: IItem, 
    day: IDay, 
    onDragOver: React.DragEventHandler<HTMLDivElement>, 
    onDragLeave: React.DragEventHandler<HTMLDivElement>, 
    onDragStart: (e: React.DragEvent<HTMLDivElement>, day: IDay, item: IItem) => void, 
    onDragEnd: React.DragEventHandler<HTMLDivElement>, 
    onDrop: React.DragEventHandler<HTMLDivElement>
}

const Item: React.FC<Interface> =({item, day, onDragOver, onDragLeave, onDragStart, onDragEnd, onDrop})=>{
    return (
        <div key={item.id} id={`${item.id}`}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDragStart={(e)=>onDragStart(e, day, item)}
                                        onDragEnd={onDragEnd}
                                        onDrop={(e)=>onDrop(e)}
                                        draggable={true}
                                        className={s.item}
                                    >
            {item.title}
        </div>
    )
}

export default Item;