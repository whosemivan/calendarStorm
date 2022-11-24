import React from "react";
import "./style.css";
import Header from "../Header";
import Calendar from "../Calendar";

const Main = ({isAuth, setIsAuth}) => {
    return (
        <>
            <Header isAuth={isAuth} setIsAuth={setIsAuth} />
            <Calendar />
        </>
    );
};

export default Main;