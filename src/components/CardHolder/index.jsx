import { useContext, useMemo } from "react";
import { useDrop } from "react-dnd";
import { Ctx } from "../App";
import Card from "../Card";

function CardHolder({ isVisiblePopup, setIsVisiblePopup, setClickedDate, setClickedId, setIsVisibleDel, clickedDate, index, i, isLoad, data, color, isAuth, cardMaxWidth, setTitle }) {
    const { socket, access } = useContext(Ctx);

    // isOver - во время наведения перетаскиваемого элемента true
    // drop - отвечат за возможность дропа
    const [{ isOver }, drop] = useDrop(useMemo(() => ({
        // тип элемента, который может принять
        accept: "event",
        // вызывает при дропе
        drop: (item) => {
            const newBeginX = index + 1;
            const newBeginY = i + 1;
            const newEndX = index + 1;
            const newEndY = i + Math.abs(item.beginning.Y - item.ending.Y) + 1;

            for (let card of data) {
                if (item.id !== card._id && card.beginning.X === newBeginX) {
                    const arr1 = Array(newEndY-newBeginY+1).fill().map((_, i) => newBeginY + i);
                    const arr2 = Array(card.ending.Y-card.beginning.Y+1).fill().map((_, i) => card.beginning.Y + i);
                    if (arr1.some(item => arr2.includes(item))) return;
                };
            }

            socket.emit("events:put", {
                id: item.id,
                beginning: {
                    X: newBeginX,
                    Y: newBeginY
                },
                ending: {
                    X: newEndX,
                    Y: newEndY
                },
            }, (data) => {
                console.log(data);
                if (data.statusCode === 200) {
                    setIsVisibleDel(false);
                }
            });
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }), [data, i, index, setIsVisibleDel, socket]))


    return <div {...(access ? { ref: drop } : {})} onClick={() => {
        if (isAuth && access) {
            setIsVisiblePopup(true); // open popup for creating cards
            setClickedDate([index + 1, i + 1]); // [x, y]
        }
    }} className={"calendar__date-pick"}>

        {/* рендерит ивенты в нужных ячейках */}
        {isLoad && data.map((card) => {
            return index + 1 === card.beginning.X && i + 1 === card.beginning.Y ? <Card isAuth={isAuth} setClickedId={setClickedId} setIsVisibleDel={setIsVisibleDel} key={index} title={card.text} color={card.color} beginX={card.beginning.X} beginY={card.beginning.Y} endX={card.ending.X} endY={card.ending.Y} id={card._id} setIsVisiblePopup={setIsVisiblePopup} cardMaxWidth={cardMaxWidth} setTitle={setTitle} /> : ""
        })}


        {/* создано для более нативного создания ивентов */}
        {clickedDate[0] === index + 1 && clickedDate[1] === i + 1 && isVisiblePopup ? (
            <div className="card card__create" style={{
                backgroundColor: '#' + color,
                opacity: "0.5"
            }}>
                <h3 className="card__title">Title...</h3>
            </div>
        ) : ""}

        {isOver ? (
            <div className="card card__create" style={{
                backgroundColor: '#' + color,
                opacity: "0.5"
            }} />
        ) : ""}
    </div>
}

export default CardHolder;