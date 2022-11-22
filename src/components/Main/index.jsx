import React, { useState, useCallback, useEffect } from "react";
import "./style.css";
import Header from "../Header";
import SignInPopup from "../SignInPopup";
import Calendar from "../Calendar";

const Main = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") || false);

    // const onEscClick = useCallback((evt) => {
    //     if (evt.key === "Escape") {
    //         setIsVisible(true);
    //     }
    // }, []);

    // useEffect(() => {
    //     document.addEventListener("keypress", onEscClick, false);

    //     return () => {
    //         document.removeEventListener("keypress", onEscClick, false);
    //     };
    // }, [onEscClick]);

    document.addEventListener('keypress', (evt) => {
        console.log(evt.key === "Escape");
    })

    console.log('user auth status:' + isAuth);

    return (
        <>
            <Header setIsVisible={setIsVisible} isAuth={isAuth} setIsAuth={setIsAuth} />
            <SignInPopup isVisible={isVisible} setIsVisible={setIsVisible} setIsAuth={setIsAuth} />
            <Calendar />
            {isVisible && <div onClick={() => setIsVisible(false)} className="overlay"></div>}
        </>
    );
};

export default Main;