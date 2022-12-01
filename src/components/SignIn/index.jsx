import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import browserHistory from "../../browser-history.js";
import { parse } from "../../utils";
import { Ctx } from "../App";

const SignIn = ({setIsAuth, isAuth}) => {
    const [login, setLogin] = useState("");
    const [pwd, setPwd] = useState("");
    const [err, setErr] = useState(false);

    const { api, setToken } = useContext(Ctx);

    useEffect(() => {
        if (parse(isAuth)) {
            browserHistory.push('/calendar/1');
        }
    }, [isAuth])

    const handler = e => {
        e.preventDefault();
        api.logIn({ login: login, password: pwd }).then(res => res.json()).then(data => {
            console.log(login);
            console.log(data.message);
            console.log(data);

            if (data.message === "Пользователь найден.") {
                console.log(data);
                localStorage.setItem("isAuth", true);
                setIsAuth(localStorage.getItem("isAuth"));
                setErr(false);

                setToken(data.data);
                browserHistory.push('/calendar/1');
            } else {
                setErr(true);
                console.log("Err");
            }
            setLogin("");
            setPwd("");
        })
    };

    return (
        <section className="signin">
            <h1 className="signin__title">Sign In</h1>
            <form onSubmit={handler} className="signin__form">
                <input className="signin__input" id="login" name="login" type="text" placeholder="Login" onChange={(e) => {
                    setLogin(e.target.value);
                    setErr(false);
                }} value={login} />
                <input className="signin__input" id="password" name="password" type="password" placeholder="Your password" onChange={(e) => {
                    setPwd(e.target.value);
                    setErr(false);
                }} value={pwd} />
                <button className="signin__btn" type="submit">Submit</button>
                {err && <p className="signin__info-err">Wrong login details, please try again</p>}
            </form>
        </section>
    );
};

export default SignIn;