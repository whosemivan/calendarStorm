import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import moment from 'moment';
import { Ctx } from "../App";

import Card from "../Card";
import CardCreator from "../CardCreator";
import CardDeletor from "../CardDeletor";

const Calendar = () => {
    const [data, setData] = useState();
    const [isLoad, setIsLoad] = useState(false);

    const [isVisiblePopup, setIsVisiblePopup] = useState(false);

    const [isVisibleDel, setIsVisibleDel] = useState(false);

    const [clickedDate, setClickedDate] = useState();
    const [clickedId, setClickedId] = useState();

    const {adminSocket} = useContext(Ctx);

    const currentMonthDates = new Array(moment().daysInMonth()).fill(null).map((x, i) => moment().startOf('month').add(i, 'days'));
    const currentMonthName = moment().format('MMMM');

    const times = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

    const currentDate = moment()._d.toString()[0] + moment()._d.toString().slice(8, 10);


    useEffect(() => {
        adminSocket.on("events:get", (data) => {
            setIsLoad(true);
            setData(data);
            console.log(data);
        });

        adminSocket.on("connect_error", (err) => console.log(err.message, err.data));

    }, []);


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
                                return <div onClick={() => {
                                    setIsVisiblePopup(true);
                                    setClickedDate([moment(day._d).format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ'), time]);
                                    console.log(moment(day._d).format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ'));
                                }} key={index} className={day._d.toString()[0] === "S" ? "calendar__date-pick calendar__date-pick--weekend" : "calendar__date-pick"}>
                                    {isLoad && data.map((card) => {
                                        return index+1 == moment(card.beginning).date() && time == moment(card.beginning).hour() ? <Card setClickedId={setClickedId} setIsVisibleDel={setIsVisibleDel} key={index} title={card.text} color={card.color} beginning={card.beginning} ending={card.ending} id={card._id} /> : ""}
                                    )}
                                </div>
                            })
                        }
                    </div>
                })
            }
            {isVisiblePopup && <CardCreator setIsVisiblePopup={setIsVisiblePopup} clickedDate={clickedDate} />}
            {isVisibleDel && <CardDeletor setIsVisibleDel={setIsVisibleDel} clickedId={clickedId} />}
        </section>
    );
};

export default Calendar;