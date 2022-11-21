import React, {useState} from "react";
import "./style.css";
import Header from "../Header";
import SignInPopup from "../SignInPopup";
import Calendar from "../Calendar";

const Main = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") || false);

    console.log(isAuth);

    return (
        <>
            <Header setIsVisible={setIsVisible} isAuth={isAuth} setIsAuth={setIsAuth} />
            <SignInPopup isVisible={isVisible} setIsVisible={setIsVisible} setIsAuth={setIsAuth} />
            <Calendar/>
            {isVisible && <div onClick={() => setIsVisible(false)} className="overlay"></div>}
        </>
    );
};

export default Main;