import React from "react";
import Container from "../../components/Container";
import s from './ErrorPage.module.scss';

const ErrorPage:React.FC = () => {
    return (
        <Container>
            <div className={s.main}>
                Oops! This page does not exist!
            </div>
        </Container>
    )
}

export default ErrorPage;