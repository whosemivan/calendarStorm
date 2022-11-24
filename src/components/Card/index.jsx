import React, {useState} from "react";
import "./style.css";

const Card = ({title, color, beginning, ending}) => {
    console.log(beginning.slice(8, 10), ending.slice(8, 10));
    console.log(color);

    const setCardWidth = () => {
        if (beginning.slice(8, 10) !== ending.slice(8, 10)) {
            return (ending.slice(8, 10) - beginning.slice(8, 10)) * 100 + '%'
        }
    };

    const setCardHeight = () => {
        if (beginning.slice(11, 13) !== ending.slice(11, 13)) {
            return (ending.slice(11, 13) - beginning.slice(11, 13)) * 100 + '%'
        }
    };

    return (
        <div className="card" style={{
            backgroundColor: '#' + color,
            width: setCardWidth(),
            height: setCardHeight()
        }}>
            <h3 className="card__title">{title}</h3>
        </div>
    );
}

export default Card;