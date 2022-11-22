import React from "react";
import "./style.css";

const Card = ({title, color}) => {
    return (
        <div className="card" style={{
            backgroundColor: color
        }}>
            <h3 className="card__title">{title}</h3>
        </div>
    );
}

export default Card;