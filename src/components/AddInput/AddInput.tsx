import React, { useState } from "react";
import s from './AddInput.module.scss';
import { nanoid } from "nanoid";
import { changeDayCard, saveChanges } from "../../redux/slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from "../../redux/selectors";
import { IItem } from "../../interfaces/interfaces";

type Input = {
    cardId: number
}

const AddInput: React.FC<Input> =({cardId})=> {
    const [itemTitle, setItemTitle] = useState('');

    const dispatch = useAppDispatch();
    const daysCards = useAppSelector(allSelectors.getDaysCards);

    function changeItemTitle(e: React.ChangeEvent<HTMLInputElement>) {
        setItemTitle(e.target.value);
    }

    function addItem(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newItem: IItem = {
            id: nanoid(),
            title: itemTitle,
            labels: []
        }
        const newCards = daysCards?.map(({id, items, holidays})=>{
            if(id === cardId) {
                return {id, holidays, items: [...items, newItem]}
            }
            return {id, items, holidays};
        })
        setItemTitle('');
        dispatch(changeDayCard(newCards));
        dispatch(saveChanges())
    }

    return (
        <form className={s.input_wrapper} onSubmit={addItem}>
            <input type="text" value={itemTitle} onChange={changeItemTitle} placeholder="Add task" required={true}/>
            <button className={s.add_btn} type="submit" >+</button>
        </form>
    )
}

export default AddInput;