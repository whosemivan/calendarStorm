import React from "react";
import { useDrag } from 'react-dnd'
import moment from "moment/moment";
import "./style.css";

const Card = ({ setClickedId, setIsVisibleDel, title, color, beginX, beginY, endX, endY, id }) => {
    // isDragging - во время перетаскивания true
    // drag - отвечат за возможность таскания
    const [{ isDragging }, drag] = useDrag(() => ({
        // тип перетаскиваемого элемента
        type: "event",
        // этот id получит ячейка в которую дропнули эту хуету. Ваня, енто полный пиздец! У меня уже мозги кипят.
        item: { id },
        // ну тут думаю понятно
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))


    // const setCardWidth = () => {
    //     if (beginning.format("DD-MM-YYYY") !== ending.format("DD-MM-YYYY")) {
    //         return (ending.diff(beginning, "days") + 1) * 60 + "px";
    //     }
    // };

    // const setCardHeight = () => {
    //     if (beginning.format("HH-MM-SS") !== ending.format("HH-MM-SS")) {
    //         return ((ending.hour() - beginning.hour()) + 1) * 60 + 'px';
    //     }
    // };

    return (
        <div ref={drag} onClick={(evt) => {
            evt.stopPropagation();
            setIsVisibleDel(true);
            setClickedId(id);
        }} className="card card-calendar" style={{
            backgroundColor: '#' + color,
            width: '100%',
            height: '100%',
            opacity: isDragging ? 0.5 : 1
        }}>
            <h3 className="card__title">{title}</h3>
        </div>
    );
}

export default Card;