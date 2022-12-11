import React, { useContext, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./style.css";
import Header from "../Header";
import Calendar from "../Calendar";
import { Ctx } from "../App";

const Main = ({ isAuth, setIsAuth, setSocket }) => {
    const { api, accToken } = useContext(Ctx);
    useEffect(() => {
        setSocket(api.scoket(accToken));
    }, [])

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