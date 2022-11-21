import React from "react";
import "./style.css";
import {parse} from "../../utils.js";

const Header = ({ setIsVisible, isAuth, setIsAuth }) => {

    const logOut = (evt) => {
        evt.preventDefault();
        localStorage.setItem("isAuth", false);
        setIsAuth(localStorage.getItem("isAuth"));
    }


    return (
        <header className="header">
            <div className="header__wrapper">
                <input type="text" className="header__title" placeholder="Calendar name" />
                <div className="header__btn-block">
                    {parse(isAuth) ?
                        <button className="header__link" onClick={logOut}>Log Out</button>
                        : <button className="header__link" onClick={() => setIsVisible(true)}>Sign In</button>
                    }
                    <button className="header__btn" type="button">
                        <span className="visually-hidden">
                            Share
                        </span>
                        <svg className="header__btn-icon" width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 7.93333L12.8333 0V4.53333C4.66667 5.66667 1.16667 11.3333 0 17C2.91667 13.0333 7 11.22 12.8333 11.22V15.8667L21 7.93333Z" fill="#312E2E" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;