import React, { useState, useContext, useMemo } from "react";
import { useDrag } from 'react-dnd'
import "./style.css";
import { Ctx } from "../App";
// ресайз
import { ResizableBox } from 'react-resizable';

const Card = ({ linesByIdWithCards, setClickedId, setIsVisibleDel, title, color, setColor, beginX, beginY, endX, endY, id, cardMaxWidth, setTitle }) => {
    const [isResize, setIsResize] = useState(false);

    // размер одной ячейки
    const CALENDAR__CELL = 60;

    const { socket, access } = useContext(Ctx);

    // isDragging - во время перетаскивания true
    // drag - отвечат за возможность таскания
    const [{ isDragging }, drag] = useDrag(useMemo(() => {
        return({
        // тип перетаскиваемого элемента
        type: "event",
        // этот id получит ячейка в которую дропнули этот ивент
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
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    })}, [beginX, beginY, endX, endY, id]))

    const cardHandler = (evt) => {
        evt.stopPropagation();
        setClickedId(id);
        setTitle(title);
        setColor(color);
    }

    const curLine = linesByIdWithCards[beginY];
    const cardsKeys = Object.keys(curLine).sort();
    const thisElemKey = cardsKeys.indexOf(String(beginX));
    const nextElem = curLine[cardsKeys[thisElemKey+1]];
    if (nextElem) cardMaxWidth = nextElem.beginning.X - 1;


    if (access) {
        return (
            // css класс card-resize нужен для того, чтобы в onResizeStop найти элемент, который ресайзили и получить его ширину.
            <ResizableBox
                className={isResize ? "card card-calendar card-resize" : "card card-calendar"}
                width={endX !== beginX ? 60 * (endX - beginX + 1) : 60} height={60}
                draggableOpts={{ grid: [60, 0] }}
                onDrop={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                handle={(h, ref) => <span style={isResize ? { opacity: 1 } : { opacity: 0.4 }} className={`card__handle-r custom-handle custom-handle-${h}`} ref={ref} />}
                minConstraints={[60, 60]} maxConstraints={[Math.abs(beginX - cardMaxWidth - 1) * 60, 60]}
                onResizeStart={() => setIsResize(true)}
                onResizeStop={(e) => {
                    e.stopPropagation();
                    const resizeWidth = document.querySelector('.card-resize');
                    const width = +resizeWidth.style.width.slice(0, -2);
                    const cellCount = width / CALENDAR__CELL;
                    const newPos = beginX + cellCount - 1;

                    resizeWidth.classList.remove('card-resize');

                    if (newPos !== endX) {
                        // запрос на изменение ending.Y, срабатывает сразу после ресайза
                        socket.emit("events:put", {
                            id: id,
                            beginning: {
                                X: beginX,
                                Y: beginY
                            },
                            ending: {
                                X: beginX + cellCount - 1,
                                Y: endY
                            },
                        }, (data) => {
                            console.log(data);
                        });
                    }

                    setIsResize(false);
                }}
            >
                <div className="card" ref={drag} onDrop={(e) => e.stopPropagation()} onDrag={ cardHandler } onClick={ (e) => { cardHandler(e); setIsVisibleDel(true); } } style={{
                    backgroundColor: '#' + color,
                    width: '100%',
                    height: '100%',
                    opacity: isDragging ? 0.7 : 1
                }}>
                    <h3 className="card__title">{title}</h3>
                </div>
            </ResizableBox>
        );
    } else {
        return (
            <ResizableBox className={isResize ? "card card-calendar card-resize" : "card card-calendar"} width={endX !== beginX ? 60 * (endX - beginX + 1) : 60} height={60}>
                <div className="card" onClick={ cardHandler } style={{
                    backgroundColor: '#' + color,
                    width: '100%',
                    height: '100%'
                }}>
                    <h3 className="card__title">{title}</h3>
                </div>
            </ResizableBox>
        )
    }
}

export default Card;