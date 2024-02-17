import React from "react";
import s from './Item.module.scss';
import { IDay, IItem } from "../../interfaces/interfaces";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { changeDayCard, saveChanges } from "../../redux/slice";
import allSelectors from "../../redux/selectors";

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

    const dispatch= useAppDispatch();
    const allDays = useAppSelector(allSelectors.getDaysCards);
    const filterByLabels = useAppSelector(allSelectors.getFilter);

    const deleteItem =()=>{
        const newAllDays = allDays?.map((stateDay)=>{
            if(stateDay.id === day.id) {
                const newItems = stateDay.items.filter(elem => elem.id !== item.id)
                return {...stateDay, items: newItems}
            }
            return stateDay;
        });
        dispatch(changeDayCard(newAllDays));
        dispatch(saveChanges());
    }

    const onLabelClick = (color: string) => {
        const newAllDays = allDays?.map((stateDay)=>{
            if(stateDay.id === day.id) {
                const newItems = stateDay.items.map(elem =>{
                    if(elem.id === item.id) {
                        if(elem.labels.includes(color)) {
                            const newLabels = [...elem.labels];
                            newLabels.splice(elem.labels.indexOf(color), 1);
                            return {...elem, labels: newLabels};
                        }
                        const newLabels = [...elem.labels, color];
                        return {...elem, labels: newLabels} 
                    }
                    return elem;
                })
                return {...stateDay, items: newItems}
            }
            return stateDay;
        });
        dispatch(changeDayCard(newAllDays));
        dispatch(saveChanges());
    }

    const greenClass = [s.label, s.label_green];
    const yellowClass = [s.label, s.label_yellow];
    const redClass = [s.label, s.label_red];
    if(item.labels.includes('green')) greenClass.push(s.green);
    if(item.labels.includes('yellow')) yellowClass.push(s.yellow);
    if(item.labels.includes('red')) redClass.push(s.red);

    let isShownItem = false;

    if(filterByLabels === 'all') isShownItem= true;
    if(item.labels.includes(filterByLabels)) isShownItem= true;

    return (
        <div key={item.id} id={`${item.id}`} className={s.item} style={isShownItem ? {display: 'block'} : {display: 'none'}}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragStart={(e)=>onDragStart(e, day, item)}
            onDragEnd={onDragEnd}
            onDrop={(e)=>onDrop(e)}
            draggable={true}
        >
            <div className={s.label_wrapp}>
                <div className={greenClass.join(' ')} onClick={(e)=> onLabelClick('green')}></div>
                <div className={yellowClass.join(' ')} onClick={(e)=> onLabelClick('yellow')}></div>
                <div className={redClass.join(' ')} onClick={(e)=> onLabelClick('red')}></div>
            </div>
            <p className={s.item_title}>{item.title}</p><span className={s.delete_icon} onClick={deleteItem}><DeleteOutlineIcon fontSize="small" className={s.icon}/></span>
        </div>
    )
}

export default Item;