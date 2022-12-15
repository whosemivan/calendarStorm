import React, { useState, useContext, useMemo } from "react";
import { useDrag } from 'react-dnd'
import "./style.css";
import { Ctx } from "../App";
// ресайз
import { ResizableBox } from 'react-resizable';

const Card = ({ isAuth, setClickedId, setIsVisibleDel, title, color, beginX, beginY, endX, endY, id, cardMaxWidth, setTitle }) => {
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


    if (access) {
        return (
            // css класс card-resize нужен для того, чтобы в onResizeStop найти элемент, который ресайзили и получить его ширину.
            <ResizableBox className={isResize ? "card card-calendar card-resize" : "card card-calendar"} width={endY !== beginY ? 60 * (endY - beginY + 1) : 60} height={60} draggableOpts={{ grid: [60, 0] }} onDrop={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} handle={(h, ref) => <span className={`card__handle custom-handle custom-handle-${h}`} ref={ref} />} minConstraints={[60, 60]} maxConstraints={[Math.abs(beginY - cardMaxWidth - 1) * 60, Math.abs(beginY - cardMaxWidth - 1) * 60]}
                onResizeStart={() => {
                    setIsResize(true);
                }}
                onResizeStop={(e) => {
                    e.stopPropagation();
                    const resizeWidth = document.querySelector('.card-resize');
                    const width = +resizeWidth.style.width.slice(0, -2);
                    const cellCount = width / CALENDAR__CELL;

                    resizeWidth.classList.remove('card-resize');

                    // запрос на изменение ending.Y, срабатывает сразу после ресайза
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

                    setIsResize(false);
                }}
            >
                <div className="card" ref={drag} onClick={(evt) => {
                    // не даём неавторизованному юзеру создавать, редактировать ивенты
                    if (isAuth && access) {
                        evt.stopPropagation();
                        setIsVisibleDel(true);
                        setClickedId(id);
                        setTitle(title);
                    }
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
    } else {
        return (
            <ResizableBox className={isResize ? "card card-calendar card-resize" : "card card-calendar"} width={endY !== beginY ? 60 * (endY - beginY + 1) : 60} height={60}>
                <div className="card" onClick={(evt) => {
                    // не даём неавторизованному юзеру создавать, редактировать ивенты
                    if (isAuth && access) {
                        evt.stopPropagation();
                        setIsVisibleDel(true);
                        setClickedId(id);
                    }
                }} style={{
                    backgroundColor: '#' + color,
                    width: '100%',
                    height: '100%',
                    opacity: isDragging ? 0.5 : 1
                }}>
                    <h3 className="card__title">{title}</h3>
                </div>
            </ResizableBox>
        )
    }
}

export default Card;