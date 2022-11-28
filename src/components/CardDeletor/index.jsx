import React, {useContext} from "react";
import "./style.css";
import { Ctx } from "../App";

const CardDeletor = ({ setIsVisibleDel, clickedId }) => {
    const {adminSocket} = useContext(Ctx);

    function handleDelete(id) {
        adminSocket.emit("events:delete", id, (data) => {
            console.log(data);
            if (data.statusCode === 200) {
                setIsVisibleDel(false);
            }
        });
    }

    return (
        <div className="card-deletor">
            <h3 className="card-deletor__title">Do you want to delete the card?</h3>
            <button className="card-deletor__btn" onClick={() => handleDelete(clickedId)}>Delete</button>
            <button className="card-deletor__close-btn" onClick={() => setIsVisibleDel(false)}>No</button>
        </div>
    );
};

export default CardDeletor;