import React from "react";
import "./style.css";
import moment from 'moment';

const Calendar = () => {

    const currentMonthDates = new Array(moment().daysInMonth()).fill(null).map((x, i) => moment().startOf('month').add(i, 'days'));
    const currentMonthName = moment().format('MMMM');

    const times = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

    const currentDate = moment()._d.toString()[0] + moment()._d.toString().slice(8, 10);
    console.log(currentDate);

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
                times.map((index) => {
                    return <div key={index} className="calendar__dates" style={{
                        top: 60 * (+index + 1)
                    }}>
                        {
                            currentMonthDates.map((day, index) => {
                                return <div key={index} className={day._d.toString()[0] === "S" ? "calendar__date-pick calendar__date-pick--weekend" : "calendar__date-pick"}></div>
                            })
                        }
                    </div>
                })
            }

        </section>
    );
};

export default Calendar;