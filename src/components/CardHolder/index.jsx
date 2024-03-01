import { useContext, useMemo } from "react";
import { useDrop } from "react-dnd";
import { Ctx } from "../App";
import Card from "../Card";

function CardHolder({ linesByIdWithCards, isVisiblePopup, setIsVisiblePopup, setClickedDate, setClickedId, setIsVisibleDel, clickedDate, index, i, isLoad, data, color, setColor, isAuth, cardMaxWidth, setTitle, setText, setLink }) {
    const { socket, access } = useContext(Ctx);

    // isOver - во время наведения перетаскиваемого элемента true
    // drop - отвечат за возможность дропа
    const [{ isOver }, drop] = useDrop(useMemo(() => ({
        // тип элемента, который может принять
        accept: "event",
        // вызывает при дропе
        drop: (item) => {
            const newBeginX = i + 1;
            const newBeginY = index + 1;
            const newEndX = i + Math.abs(item.beginning.X - item.ending.X) + 1;
            const newEndY = index + 1;
            const curLine = linesByIdWithCards[newBeginY];

            for (let key in curLine) {
                if (item.id !== curLine[key]._id && curLine[key].beginning.Y === newBeginY) {
                    console.log(curLine[key]);
                    const arr1 = Array(newEndX-newBeginX+1).fill().map((_, i) => newBeginX+i);
                    const arr2 = Array(curLine[key].ending.X-curLine[key].beginning.X+1).fill().map((_, i) => curLine[key].beginning.X+i);
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
    }), [i, index, setIsVisibleDel, socket, linesByIdWithCards]))


    return <div {...(access ? { ref: drop } : { style: { cursor: "default" } })} onClick={() => {
        if (isAuth && access) {
            setIsVisiblePopup(true); // open popup for creating cards
            setClickedDate([i + 1, index + 1]); // [x, y]
        }
    }} className={"calendar__date-pick"}>

        {/* рендерит ивенты в нужных ячейках */}
        {isLoad && data.map((card) => {
            if (i + 1 === card.beginning.X && index + 1 === card.beginning.Y) {
                const curLine = linesByIdWithCards[card.beginning.Y];
                const cardsKeys = Object.keys(curLine);
                const thisElemKey = cardsKeys.indexOf(String(card.beginning.X));
                const nextElem = curLine[cardsKeys[thisElemKey+1]];

                return <Card linesByIdWithCards={linesByIdWithCards} setClickedId={setClickedId} setIsVisibleDel={setIsVisibleDel} key={index} title={card.title} text={card.text} link={card.link} color={card.color} setColor={setColor} beginX={card.beginning.X} beginY={card.beginning.Y} endX={card.ending.X} endY={card.ending.Y} id={card._id} setIsVisiblePopup={setIsVisiblePopup} cardMaxWidth={nextElem ? nextElem.beginning.X - 1 : cardMaxWidth} setTitle={setTitle} setText={setText} setLink={setLink} />
            }
            return "";
        })}

        {/* создано для более нативного создания ивентов */}
        {clickedDate[0] === i + 1 && clickedDate[1] === index + 1 && isVisiblePopup ? (
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
