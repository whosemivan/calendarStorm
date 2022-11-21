import React, {useState} from "react";
import "./style.css";
import Header from "../Header";
import SignInPopup from "../SignInPopup";
import Calendar from "../Calendar";

const Main = () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <Header setIsVisible={setIsVisible}/>
            <SignInPopup isVisible={isVisible} setIsVisible={setIsVisible} />
            <Calendar/>
            {isVisible && <div onClick={() => setIsVisible(false)} className="overlay"></div>}
        </>
    );
};

export default Main;