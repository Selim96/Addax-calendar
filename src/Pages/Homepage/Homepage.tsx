import React from "react";
import { useAppSelector } from "../../redux/hooks";
import allSelectors from '../../redux/selectors';
import Container from "../../components/Container";
import s from './Homepage.module.scss';

const Homepage: React.FC = () => {
    

    return (
        <Container>
            <main className={s.mainBox}>
                <h1 className={s.title} id="title">Calendar</h1>
                
                
            </main>
        </Container>)
}

export default Homepage;
