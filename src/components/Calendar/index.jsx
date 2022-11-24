import React, { useEffect, useState } from "react";
import "./style.css";
import moment from 'moment';
import io from 'socket.io-client';

import Card from "../Card";

const Calendar = () => {
    const [data, setData] = useState();
    const [isLoad, setIsLoad] = useState(false);

    const currentMonthDates = new Array(moment().daysInMonth()).fill(null).map((x, i) => moment().startOf('month').add(i, 'days'));
    const currentMonthName = moment().format('MMMM');

    console.log(currentMonthDates);

    const times = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

    const currentDate = moment()._d.toString()[0] + moment()._d.toString().slice(8, 10);
    console.log(currentDate);

    const socket = io("https://calender-storm.herokuapp.com/", { transports: ["websocket"] });

    // Это штука получает ответ от сервера. После загрузки страницы мы получим ответ от сервера с карточками событий на этот месяц.

    useEffect(() => {
        socket.on("events:get", (data) => {
            setIsLoad(true);
            setData(data);
            console.log(data);
        });
    }, []);

    // Запрос для получения карточек событий на следующий месяц.

    function getEvents() {
        socket.emit("events:get", 1);
        console.log('slkjfnd');
    }

    // socket.emit("events:post", {});
    // socket.emit("events:delete", 'id');
    // socket.emit("events:put", {id, ...});


    return (
        <section className="calendar">
            <h2 className="visually-hidden">Calendar</h2>
            <div className="calendar__top-panel">
                {
                    <span className="calendar__month-name">
                        {currentMonthName}
                    </span>
                }
                {
                    currentMonthDates.map((day, index) => {
                        return (
                            <div className={currentDate === day._d.toString()[0] + day._d.toString().slice(8, 10) ? "calendar__date calendar__date--current" : "calendar__date"} key={index}>{day._d.toString()[0] + day._d.toString().slice(8, 10)}</div>
                        )
                    })
                }
            </div>
            <div className="calendar__left-panel">
                {
                    times.map((time, index) => {
                        return <div className="calendar__time" key={index}>{time}</div>
                    })
                }
            </div>
            {
                times.map((time, index) => {
                    return <div key={index} className="calendar__dates" style={{
                        top: 60 * (+index + 1)
                    }}>
                        {
                            currentMonthDates.map((day, index) => {
                                return <div key={index} className={day._d.toString()[0] === "S" ? "calendar__date-pick calendar__date-pick--weekend" : "calendar__date-pick"}>
                                    {isLoad && data.map((card) =>
                                        index === +card.beginning.slice(8, 10) && time === card.beginning.slice(11, 13) ? <Card key={index} title={card.text} color={card.color} beginning={card.beginning} ending={card.ending} /> : ""
                                    )}
                                </div>
                            })
                        }
                    </div>
                })
            }
        </section>
    );
};

export default Calendar;