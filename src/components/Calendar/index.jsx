import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import moment from 'moment';
import { Ctx } from "../App";
import CardCreator from "../CardCreator";
import CardEditor from "../CardEditor";
import CardHolder from "../CardHolder";
import browserHistory from "../../browser-history";
// import browserHistory from "../../browser-history.js";

const Calendar = () => {
    const { api, socket, refToken, setAccToken, setRefToken, setIsAuth } = useContext(Ctx);
    const [data, setData] = useState();
    const [isLoad, setIsLoad] = useState(false);
    const [isCalendarLoad, setIsCalendarLoad] = useState(false);

    const [isVisiblePopup, setIsVisiblePopup] = useState(false);
    const [isVisibleDel, setIsVisibleDel] = useState(false);

    const [clickedDate, setClickedDate] = useState([]);
    const [clickedId, setClickedId] = useState();
    const [color, setColor] = useState('C8F9C5');

    const [x, setX] = useState([]);
    const [y, setY] = useState([]);

    // dates in this month
    // const currentMonthDates = new Array(moment().daysInMonth()).fill(null).map((x, i) => moment().startOf('month').add(i, 'days'));
    // const currentMonthName = moment().format('MMMM');
    const currentDate = moment()._d.toString()[0] + moment()._d.toString().slice(8, 10);

    // mocks data
    // const y = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    // const x = ['T01', 'W02', 'T03', 'F04', 'S05', 'S06', 'M07', 'T08', 'W09', 'T10', 'F11', 'S12', 'S13', 'M14', 'T15', 'W16', 'T17', 'F18', 'S19', 'S20', 'M21', 'T22', 'W23', 'T24', 'F25', 'S26', 'S27', 'M28', 'T29', 'W30', 'T31'];


    // get cards 
    useEffect(() => {
        // Извини за это тупорылое решение, но были проблемы с подключением сокетов на странице авторизации.
        if (socket) {
            // !!!!!!!
            // Меняю calendars:get на calendar:get. Мне кажется будет правилей отправлять полную информацию о календаре при заходе в него, а список календарей вместе с базовой информацией о них ( название и его id ).
            // При выборе календаря нужно будет отправлять его id по этому пути. Сейчас этот путь автоматически выдает созданный календарь админа при его решистрации. Также на этот путь будет приходить информация для обычного пользователя.
            socket.on("calendar:get", (data) => {
                // это временная фигня, которая нужна для ссылки на календарь. В будущем она будет получена при выборе календаря из списка.
                browserHistory.push(data.data._id);
                // // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                setX(data.data.X);
                setY(data.data.Y);
                console.log('there', data);
                setIsCalendarLoad(true);
            });

            socket.on("events:get", (data) => {
                setIsLoad(true);
                console.log(data.data);
                setData(data.data);
            });

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
    }, [socket]);

    useEffect(() => {
        console.log(`state is `, clickedDate);
    }, [clickedDate]);


    return (
        <section className="calendar">
            <h2 className="visually-hidden">Calendar</h2>
            <div className="calendar__top-panel">

                {/* <span className="calendar__month-name">
                    {currentMonthName}
                </span> */}

                {
                    isCalendarLoad && x.map((item, index) => {
                        return (
                            <div className={currentDate === item ? "calendar__date calendar__date--current" : "calendar__date"} key={index}>{item}</div>
                        )
                    })
                }
            </div>
            <div className="calendar__left-panel">
                {
                    isCalendarLoad && y.map((item, index) => {
                        return <div className="calendar__time" key={index}>
                            <input type="text" className="calendar__time-input" placeholder={item} />
                        </div>
                    })
                }
            </div>
            {
                y.map((date, index) => {
                    return <div key={index} className="calendar__dates" style={{
                        top: 60 * (+index + 1) + 100
                    }}>
                        {
                            x.map((day, i) => <CardHolder key={i} isVisiblePopup={isVisiblePopup} setIsVisiblePopup={setIsVisiblePopup} setClickedDate={setClickedDate} setClickedId={setClickedId} setIsVisibleDel={setIsVisibleDel} clickedDate={clickedDate} index={index} i={i} isLoad={isLoad} data={data} color={color} />)
                        }
                    </div>
                })
            }
            <CardCreator color={color} setColor={setColor} setClickedDate={setClickedDate} isVisiblePopup={isVisiblePopup} setIsVisiblePopup={setIsVisiblePopup} clickedDate={clickedDate} />
            <CardEditor color={color} setColor={setColor} setIsVisibleDel={setIsVisibleDel} isVisibleDel={isVisibleDel} clickedId={clickedId} />
        </section>
    );
};

export default Calendar;