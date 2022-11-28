import React from "react";
import "./style.css";
import io from 'socket.io-client';

const CardDeletor = ({ setIsVisibleDel, clickedId }) => {

    const adminSocket = io("https://calender-storm.herokuapp.com/api/admin", {
        transports: ["websocket"],
        auth: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzdhMDUxMmUwOWU5NzA2ZjQ5ZmVlOTUiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjY5NDc0NzMwLCJleHAiOjE2Njk3MzM5MzB9.5a9iZKjeXXmnqSKUWo394a9MQYtOtBcNBqLErlXwEUM" }
    });

    function handleDelete(id) {
        adminSocket.emit("events:delete", id, (data) => {
            console.log(data);
            if (data.statusCode = 200) {
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