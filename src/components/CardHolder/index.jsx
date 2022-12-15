import { useContext } from "react";
import { useDrop } from "react-dnd";
import { Ctx } from "../App";
import Card from "../Card";

function CardHolder({ isVisiblePopup, setIsVisiblePopup, setClickedDate, setClickedId, setIsVisibleDel, clickedDate, index, i, isLoad, data, color, isAuth }) {
    const { socket } = useContext(Ctx);

    // isOver - во время наведения перетаскиваемого элемента true
    // drop - отвечат за возможность дропа
    const [{ isOver }, drop] = useDrop(() => ({
        // тип элемента, который может принять
        accept: "event",
        // вызывает при дропе
        drop: (item) => {
            socket.emit("events:put", {
                id: item.id,
                beginning: {
                    X: index + 1,
                    Y: i + 1
                },
                ending: {
                    X: index + Math.abs(item.beginning.X - item.ending.X) + 1,
                    Y: i + Math.abs(item.beginning.Y - item.ending.Y) + 1
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
    }))


    return <div ref={drop} onClick={() => {
        if (isAuth) {
            setIsVisiblePopup(true); // open popup for creating cards
            setClickedDate([index + 1, i + 1]); // [x, y]
        }
    }} className={"calendar__date-pick"}>

        {/* рендерит ивенты в нужных ячейках */}
        {isLoad && data.map((card) => {
            return index + 1 === card.beginning.X && i + 1 === card.beginning.Y ? <Card isAuth={isAuth} setClickedId={setClickedId} setIsVisibleDel={setIsVisibleDel} key={index} title={card.text} color={card.color} beginX={card.beginning.X} beginY={card.beginning.Y} endX={card.ending.X} endY={card.ending.Y} id={card._id} setIsVisiblePopup={setIsVisiblePopup} /> : ""
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