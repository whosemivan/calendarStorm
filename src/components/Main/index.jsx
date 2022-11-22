import React, { useState, useEffect } from "react";
import "./style.css";
import Header from "../Header";
import SignInPopup from "../SignInPopup";
import Calendar from "../Calendar";

const Main = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") || false);

    useEffect(() => {
        const close = (e) => {
            if (e.key === "Escape") {
                setIsVisible(false);
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, []);

    document.addEventListener('keypress', (evt) => {
        console.log(evt.key === "Escape");
    })

    console.log('user auth status:' + isAuth);

    return (
        <>
            <Header setIsVisible={setIsVisible} isAuth={isAuth} setIsAuth={setIsAuth} />
            <SignInPopup isVisible={isVisible} setIsVisible={setIsVisible} setIsAuth={setIsAuth} />
            <Calendar />
            <div onClick={() => setIsVisible(false)} className={isVisible ? "overlay overlay--show" : "overlay"}></div>
        </>
    );
};

export default Main;