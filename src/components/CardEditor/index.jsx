import React, { useContext, useState } from "react";
import "./style.css";
import { Ctx } from "../App";
import ColorPicker from "../ColorPicker";

const CardEditor = ({ setIsVisibleDel, clickedId, color, setColor, isVisibleDel }) => {
    const { socket } = useContext(Ctx);
    const [title, setTitle] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // удаление ивента
    function handleDelete(id) {
        socket.emit("events:delete", id, (data) => {
            console.log(data);
            if (data.statusCode === 200) {
                setIsVisibleDel(false);
            }
        });
    }

    // изменение ивента
    function handleEdit(evt) {
        evt.preventDefault();
        socket.emit("events:put", {
            id: clickedId,
            text: title,
            color: color
        }, (data) => {
            console.log(data);
            if (data.statusCode === 200) {
                setIsVisibleDel(false);
            }
        });
    }

    return (
        <div className={isVisibleDel ? "card-editor card-editor--visible" : "card-editor"}>
            <button className="card-editor__close-btn" onClick={() => {
                setIsVisibleDel(false);
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.2929 3.12425C23.6834 2.73372 23.6834 2.10056 23.2929 1.71004L22.29 0.707106C21.8994 0.316582 21.2663 0.316582 20.8758 0.707107L12.7071 8.87575C12.3166 9.26628 11.6834 9.26628 11.2929 8.87575L3.12425 0.707106C2.73372 0.316582 2.10056 0.316582 1.71004 0.707107L0.707106 1.71004C0.316582 2.10056 0.316582 2.73373 0.707107 3.12425L8.87575 11.2929C9.26628 11.6834 9.26628 12.3166 8.87575 12.7071L0.707106 20.8758C0.316582 21.2663 0.316582 21.8994 0.707107 22.29L1.71004 23.2929C2.10056 23.6834 2.73373 23.6834 3.12425 23.2929L11.2929 15.1242C11.6834 14.7337 12.3166 14.7337 12.7071 15.1242L20.8758 23.2929C21.2663 23.6834 21.8994 23.6834 22.29 23.2929L23.2929 22.29C23.6834 21.8994 23.6834 21.2663 23.2929 20.8758L15.1242 12.7071C14.7337 12.3166 14.7337 11.6834 15.1242 11.2929L23.2929 3.12425Z" fill="#1E1E1E" />
                </svg>
            </button>

            <form onSubmit={handleEdit}>
                <div className="card-editor__wrapper">
                    <div onClick={() => setIsVisible(true)} className="card-editor__color" style={{
                        backgroundColor: '#' + color
                    }}></div>
                    {isVisible && <ColorPicker setColor={setColor} setIsVisible={setIsVisible} />}
                    <input onChange={(e) => {
                        setTitle(e.target.value);
                    }} type="text" className="card-editor__input card-editor__input--title" placeholder="Change task name..." />
                </div>
                <button type="submit" className="card-editor__button">Change</button>
            </form>

            <button className="card-editor__btn-del" onClick={() => handleDelete(clickedId)}>Delete</button>
        </div>
    );
};

export default CardEditor;