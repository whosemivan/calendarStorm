import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import moment from 'moment';
import { Ctx } from "../App";
import Card from "../Card";
import CardCreator from "../CardCreator";
import CardDeletor from "../CardDeletor";
import browserHistory from "../../browser-history.js";

const Calendar = () => {
    const { api, adminSocket, setIsAuth, token } = useContext(Ctx);
    const [data, setData] = useState();
    const [isLoad, setIsLoad] = useState(false);

    const [isVisiblePopup, setIsVisiblePopup] = useState(false);
    const [isVisibleDel, setIsVisibleDel] = useState(false);

    const [clickedDate, setClickedDate] = useState();
    const [clickedId, setClickedId] = useState();


    // const currentMonthDates = new Array(moment().daysInMonth()).fill(null).map((x, i) => moment().startOf('month').add(i, 'days'));
    const currentMonthName = moment().format('MMMM');
    const currentDate = moment()._d.toString()[0] + moment()._d.toString().slice(8, 10);

    // mocks data
    const y = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    const x = ['T01', 'W02', 'T03', 'F04', 'S05', 'S06', 'M07', 'T08', 'W09', 'T10', 'F11', 'S12', 'S13', 'M14', 'T15', 'W16', 'T17', 'F18', 'S19', 'S20', 'M21', 'T22', 'W23', 'T24', 'F25', 'S26', 'S27', 'M28', 'T29', 'W30', 'T31'];


    // get cards 
    useEffect(() => {
        adminSocket.on("calendars:get", (data) => {
            setIsLoad(true);
            setData(data);
            console.log(data);
        });

        adminSocket.on("connect_error", (err) => {
            console.log(err.message);
            if (err.message === "Токен недействителен.") {
                // console.log(token.refreshToken);
                api.refresh(token).then(res => res.json()).then(data => {
                    console.log(data);
                })
            }
        });
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
                    x.map((item, index) => {
                        return (
                            <div className={currentDate === item ? "calendar__date calendar__date--current" : "calendar__date"} key={index}>{item}</div>
                        )
                    })
                }
            </div>
            <div className="calendar__left-panel">
                {
                    y.map((item, index) => {
                        return <div className="calendar__time" key={index}>{item}</div>
                    })
                }
            </div>
            {
                y.map((item, index) => {
                    return <div key={index} className="calendar__dates" style={{
                        top: 60 * (+index + 1) + 100
                    }}>
                        {
                            x.map((day, index) => {
                                return <div onClick={() => {
                                    setIsVisiblePopup(true); // open popup for creating cards
                                    setClickedDate([day, item]); // [x, y]
                                }} key={index} className={day[0] === "S" ? "calendar__date-pick calendar__date-pick--weekend" : "calendar__date-pick"}>
                                    {/* render cards! wait for a new backend */}

                                    {/* {isLoad && data.map((card) => {
                                        return index+1 == moment(card.beginning).date() && item == moment(card.beginning).hour() ? <Card setClickedId={setClickedId} setIsVisibleDel={setIsVisibleDel} key={index} title={card.text} color={card.color} beginning={card.beginning} ending={card.ending} id={card._id} /> : ""}
                                    )} */}
                                </div>
                            })
                        }
                    </div>
                })
            }
            <CardCreator isVisiblePopup={isVisiblePopup} setIsVisiblePopup={setIsVisiblePopup} clickedDate={clickedDate} />
            {isVisibleDel && <CardDeletor setIsVisibleDel={setIsVisibleDel} clickedId={clickedId} />}
        </section>
    );
};

export default Calendar;