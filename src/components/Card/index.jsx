import React from "react";
import moment from "moment/moment";
import "./style.css";

const Card = ({ setClickedId, setIsVisibleDel, title, color, beginning, ending, id }) => {
    beginning = moment(beginning);
    ending = moment(ending);

    const setCardWidth = () => {
        if (beginning.format("DD-MM-YYYY") !== ending.format("DD-MM-YYYY")) {
            return (ending.diff(beginning, "days") + 1) * 60 + "px";
        }
    };

    const setCardHeight = () => {
        if (beginning.format("HH-MM-SS") !== ending.format("HH-MM-SS")) {
            return ((ending.hour() - beginning.hour()) + 1) * 60 + 'px';
        }
    };

    return (
        <div onClick={(evt) => {
            evt.stopPropagation();
            setIsVisibleDel(true);
            setClickedId(id);
        }} className="card card-calendar" style={{
            backgroundColor: '#' + color,
            width: setCardWidth(),
            height: setCardHeight()
        }}>
            <h3 className="card__title">{title}</h3>
        </div>
    );
}

export default Card;