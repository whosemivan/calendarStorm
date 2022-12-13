import React, { useState, useContext, useEffect } from "react";
import { useDrag } from 'react-dnd'
import "./style.css";
import { Ctx } from "../App";

// ресайз
import { ResizableBox } from 'react-resizable';

const Card = ({ setClickedId, setIsVisibleDel, title, color, beginX, beginY, endX, endY, id }) => {
    const [isResize, setIsResize] = useState(false);
    // const [resizeDiff, setResizeDiff] = useState();

    const CALENDAR__CELL = 60;
    const { socket } = useContext(Ctx);
    // isDragging - во время перетаскивания true
    // drag - отвечат за возможность таскания
    const [{ isDragging }, drag] = useDrag(() => ({
        // тип перетаскиваемого элемента
        type: "event",
        // этот id получит ячейка в которую дропнули эту хуету. Ваня, енто полный пиздец! У меня уже мозги кипят.
        item: {
            id, 
            beginning: {
                X: beginX,
                Y: beginY
            },
            ending: {
                X: endX,
                Y: endY
            }
        },
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
        <ResizableBox className={isResize ? "card card-calendar card-resize" : "card card-calendar"} width={endY !== endX ? 60 * (endY - endX) : 60} height={60} draggableOpts={{ grid: [60, 0] }} handleSize={[10, 10]} handle={(h, ref) => <span className={`card__handle custom-handle custom-handle-${h}`} ref={ref} />} minConstraints={[60, 60]}
            onResizeStart={() => {
                setIsResize(true);
            }}
            onResizeStop={() => {
                const resizeWidth = document.querySelector('.card-resize');
                const width = +resizeWidth.style.width.slice(0, -2);

                const cellCount = width / CALENDAR__CELL;
                // setResizeDiff(cellCount);

                resizeWidth.classList.remove('card-resize');

                socket.emit("events:put", {
                    id: id,
                    beginning: {
                        X: beginX,
                        Y: beginY
                    },
                    ending: {
                        X: endX,
                        Y: beginY + cellCount - 1
                    },
                }, (data) => {
                    console.log(data);
                });

            }}
        >
            <div className="card" ref={drag} onClick={(evt) => {
                evt.stopPropagation();
                setIsVisibleDel(true);
                setClickedId(id);
            }} style={{
                backgroundColor: '#' + color,
                width: '100%',
                height: '100%',
                opacity: isDragging ? 0.5 : 1
            }}>
                <h3 className="card__title">{title}</h3>
            </div>
        </ResizableBox>
    );
}

export default Card;