import { useContext, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { Ctx } from "../App";
import Card from "../Card";

function CardHolder({ isVisiblePopup, setIsVisiblePopup, setClickedDate, setClickedId, setIsVisibleDel, clickedDate, index, i, isLoad, data, color }) {
    const { socket } = useContext(Ctx);
    // const [selectItem, setSelectItem] = useState();

    // useEffect(() => {
    //     console.log(selectItem);
    // }, [selectItem]);

    // isOver - во время наведения перетаскиваемого элемента true
    // drop - отвечат за возможность дропа
    const [{ isOver }, drop] = useDrop(() => ({
        // тип элемента, который может принять
        accept: "event",
        // вызывает при дропе
        drop: (item) => {
            console.log(item);
            socket.emit("events:put", {
                id: item.id,
                beginning: {
                    X: index + 1,
                    Y: i + 1
                },
                ending: item.ending,
            }, (data) => {
                console.log(data);
                if (data.statusCode === 200) {
                    setIsVisibleDel(false);
                }
            });
        },
        // ну тут думаю понятно
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }))



    return <div ref={drop} onClick={() => {
        setIsVisiblePopup(true); // open popup for creating cards
        setClickedDate([index + 1, i + 1]); // [x, y]
    }} className={"calendar__date-pick"} /* className={day[0] === "S" ? "calendar__date-pick calendar__date-pick--weekend" : "calendar__date-pick"} */>

        {isLoad && data.map((card) => {
            return index + 1 === card.beginning.X && i + 1 === card.beginning.Y ? <Card setClickedId={setClickedId} setIsVisibleDel={setIsVisibleDel} key={index} title={card.text} color={card.color} beginX={card.beginning.X} beginY={card.beginning.Y} endX={card.ending.X} endY={card.ending.Y} id={card._id} /> : ""
        })}

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