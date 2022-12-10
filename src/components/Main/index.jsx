import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./style.css";
import Header from "../Header";
import Calendar from "../Calendar";

const Main = ({ isAuth, setIsAuth }) => {
    return (
        <>
            <Header isAuth={isAuth} setIsAuth={setIsAuth} />
            <DndProvider backend={HTML5Backend}>
                <Calendar />
            </DndProvider>
        </>
    );
};

export default Main;