import React from "react";
import "./style.css";

const Card = ({ setClickedId, setIsVisibleDel, title, color, beginning, ending, id }) => {

    console.log(beginning, ending);
    const setCardWidth = () => {
        if (beginning.slice(8, 10) !== ending.slice(8, 10)) {
            return (ending.slice(8, 10) - beginning.slice(8, 10)) * 60 + 'px'
        }
    };

    const setCardHeight = () => {
        if (beginning.slice(11, 13) !== ending.slice(11, 13)) {
            return (ending.slice(11, 13) - beginning.slice(11, 13)) * 60 + 'px'
        }
    };

    return (
        <div onClick={(evt) => {
            evt.stopPropagation();
            setIsVisibleDel(true);
            setClickedId(id);
        }} className="card" style={{
            backgroundColor: '#' + color,
            width: setCardWidth(),
            height: setCardHeight()
        }}>
            <h3 className="card__title">{title}</h3>
        </div>
    );
}

export default Card;