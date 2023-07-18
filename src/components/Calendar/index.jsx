import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import "./style.css";
import { Ctx } from "../App";
import CardCreator from "../CardCreator";
import CardEditor from "../CardEditor";
import CardHolder from "../CardHolder";
import browserHistory from "../../browser-history";

const Calendar = ({isAuth}) => {
    const { api, socket, refToken, setAccToken, setRefToken, setIsAuth, setCalendarName, calendarId, setCalendarId, access, setAccess } = useContext(Ctx);
    const [data, setData] = useState();

    const [isLoad, setIsLoad] = useState(false);
    const [isCalendarLoad, setIsCalendarLoad] = useState(false);
    const [isVisiblePopup, setIsVisiblePopup] = useState(false);
    const [isVisibleDel, setIsVisibleDel] = useState(false);

    const [clickedDate, setClickedDate] = useState([]);
    const [clickedId, setClickedId] = useState();
    const [color, setColor] = useState('C8F9C5');
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const [x, setX] = useState([]);
    const [y, setY] = useState([]);

    const [linesByIdWithCards, setLinesByIdWithCards] = useState([]);

    useEffect(() => {
        if (socket) {

            // получает инфу о календаре: id, название, владелец каленадря, x, y

            socket.on("calendar:get", (data) => {
                console.log(data);
                // это временная фигня, которая нужна для ссылки на календарь. В будущем она будет получена при выборе календаря из списка.
                browserHistory.push(data.data._id);
                setAccess(data.access);
                setCalendarName(data.data.title);
                setCalendarId(data.data._id);
                setX(data.data.X);
                setY(data.data.Y);
                setIsCalendarLoad(true);
            });

            // получает массив с ивентами

            socket.on("events:get", (data) => {
                console.log(data);
                setData(data.data || []);

                let linesWithCards = {};
                data?.data?.forEach((card) => {
                    if (linesWithCards[card.beginning.Y]) {
                        linesWithCards[card.beginning.Y][card.beginning.X] = card;
                    } else {
                        linesWithCards[card.beginning.Y] = {};
                        linesWithCards[card.beginning.Y][card.beginning.X] = card;
                    }
                })
                setLinesByIdWithCards(linesWithCards);

                setIsLoad(true);
            });

            // обновляет токены, если connect_error

            socket.on("connect_error", (err) => {
                console.log(err);
                if (err.data.statusCode !== 200) {
                    setAccToken("");

                    if (!refToken) {
                        localStorage.setItem("isAuth", false);
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        setIsAuth(false);
                        setRefToken("");
                        return;
                    }

                    api.refresh({ refreshToken: refToken }).then(res => res.json()).then(data => {
                        console.log(data);
                        localStorage.setItem("accessToken", data.data.accessToken);
                        setAccToken(data.data.accessToken);
                        localStorage.setItem("refreshToken", data.data.refreshToken);
                        setRefToken(data.data.refreshToken)

                        socket.auth = { accessToken: data.data.accessToken };
                        socket.connect();
                    })
                }
            });
        }
    }, [api, refToken, setAccToken, setIsAuth, setRefToken, socket, setAccess, setCalendarId, setCalendarName]);

    // добавил для корректной работы стейта

    useEffect(() => {
        console.log(`state is `, clickedDate);
    }, [clickedDate]);

    return (
        <section className="calendar">
            <h2 className="visually-hidden">Calendar</h2>
            <div className="calendar__top-panel">

                <span className="calendar__month-name">
                    {moment().format("MMMM")}
                </span> 

                {
                    // рендерит даты
                    isCalendarLoad && x.map((item, index) => {
                        return (
                            <div className="calendar__date" key={index}>{item}</div>
                        )
                    })
                }
            </div>
            <div className="calendar__left-panel">
                {
                    // рендерит строки
                    isCalendarLoad && y.map((item, index) => {
                        return <div className="calendar__time" key={index}>
                            {
                                access ? 
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const input = e.target.querySelector('[name="name"]');
                                    y[index] = input.value;
                                    socket.emit("calendars:put", {
                                        id: calendarId, Y: y
                                    }, (data) => console.log(data));
                                }}>
                                    <input type="text" name="name" className="calendar__time-input" required defaultValue={item} />
                                </form> 
                                : <p className="calendar__time-input">{item}</p>
                            }
                        </div>
                    })
                }
            </div>
            {
                // рендерит поля и ивенты (логика рендера ивентов в CardHolder)
                y.map((item, index) => {
                    return <div key={index} className={y.length - 1 === index ? "calendar__dates calendar__dates--last" : "calendar__dates"} style={{
                        top: 60 * (+index + 1) + 100
                    }}>
                        {
                            x.map((date, i) => <CardHolder linesByIdWithCards={linesByIdWithCards} isAuth={isAuth} key={i} isVisiblePopup={isVisiblePopup} setIsVisiblePopup={setIsVisiblePopup} setClickedDate={setClickedDate} setClickedId={setClickedId} setTitle={setTitle} setIsVisibleDel={setIsVisibleDel} clickedDate={clickedDate} index={index} i={i} isLoad={isLoad} data={data} color={color} setColor={setColor} cardMaxWidth={x.length} />)
                        }
                    </div>
                })
            }
            {/* попапы для создания и изменения ивентов */}
            <CardCreator color={color} setColor={setColor} setClickedDate={setClickedDate} isVisiblePopup={isVisiblePopup} setIsVisiblePopup={setIsVisiblePopup} clickedDate={clickedDate} />
            <CardEditor title={title} setTitle={setTitle} text={text} setText={setText} color={color} setColor={setColor} setIsVisibleDel={setIsVisibleDel} isVisibleDel={isVisibleDel} clickedId={clickedId} data={data} isLoad={isLoad} />
        </section>
    );
};

export default Calendar;
