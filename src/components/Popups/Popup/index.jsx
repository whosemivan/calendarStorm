import React from "react";
import "./style.css";

const Popup = ({title, text, children}) => {
    // popup в которой нужно будет передавать в children кнопку авторизоваться через телегу, если юзер не авторизовался через неё изначально
    return (
        <div className="popup">
            <h3 className="popup__title">{title}</h3>
            <p className="popup__text">{text}</p>
            {
                children
            }
        </div>
    );
};

export default Popup;