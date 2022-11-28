import React, { useState } from "react";
import "./style.css";

import ColorPicker from "../ColorPicker";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import TextField from '@mui/material/TextField';

import moment from 'moment';
import io from 'socket.io-client';

const CardCreator = ({ setIsVisiblePopup, clickedDate }) => {
    const [color, setColor] = useState('C8F9C5');
    const [isVisible, setIsVisible] = useState(false);

    const [valueBegin, setValueBegin] = useState(clickedDate[0].replace('00', clickedDate[1]));
    // console.log(valueBegin);
    const [valueEnd, setValueEnd] = useState(clickedDate[0].replace('00', clickedDate[1]));
    const [title, setTitle] = useState("");

    const adminSocket = io("https://calender-storm.herokuapp.com/api/admin", {
        transports: ["websocket"],
        reconnectionDelayMax: 10000,
        auth: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzdhMDUxMmUwOWU5NzA2ZjQ5ZmVlOTUiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjY5NDc0NzMwLCJleHAiOjE2Njk3MzM5MzB9.5a9iZKjeXXmnqSKUWo394a9MQYtOtBcNBqLErlXwEUM" }
    });

    console.log(valueBegin, valueEnd);


    const handleSubmit = (evt) => {
        evt.preventDefault();
        adminSocket.emit("events:post", {
            text: title,
            color: color,   
            beginning: valueBegin,
            ending: valueEnd
        }, (data) => {
            setIsVisiblePopup(false);
            console.log(data);
        });
    };

    return (
        <div className="card-creator">
            <button className="card-creatotr__close-btn" onClick={() => setIsVisiblePopup(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.2929 3.12425C23.6834 2.73372 23.6834 2.10056 23.2929 1.71004L22.29 0.707106C21.8994 0.316582 21.2663 0.316582 20.8758 0.707107L12.7071 8.87575C12.3166 9.26628 11.6834 9.26628 11.2929 8.87575L3.12425 0.707106C2.73372 0.316582 2.10056 0.316582 1.71004 0.707107L0.707106 1.71004C0.316582 2.10056 0.316582 2.73373 0.707107 3.12425L8.87575 11.2929C9.26628 11.6834 9.26628 12.3166 8.87575 12.7071L0.707106 20.8758C0.316582 21.2663 0.316582 21.8994 0.707107 22.29L1.71004 23.2929C2.10056 23.6834 2.73373 23.6834 3.12425 23.2929L11.2929 15.1242C11.6834 14.7337 12.3166 14.7337 12.7071 15.1242L20.8758 23.2929C21.2663 23.6834 21.8994 23.6834 22.29 23.2929L23.2929 22.29C23.6834 21.8994 23.6834 21.2663 23.2929 20.8758L15.1242 12.7071C14.7337 12.3166 14.7337 11.6834 15.1242 11.2929L23.2929 3.12425Z" fill="#1E1E1E" />
                </svg>
            </button>
            <form onSubmit={handleSubmit} className="card-creator__form">
                <div className="card-creator__wrapper">
                    <div onClick={() => setIsVisible(true)} className="card-creator__color" style={{
                        backgroundColor: '#' + color
                    }}></div>
                    {isVisible && <ColorPicker setColor={setColor} setIsVisible={setIsVisible} />}
                    <input onChange={(e) => {
                        setTitle(e.target.value);
                    }} type="text" className="card-creator__input card-creator__input--title" placeholder="Type task name..." />
                </div>
                <div className="card-creator__wrapper">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            label="From"
                            value={valueBegin}
                            onChange={(newValue) => {
                                console.log(newValue);
                                console.log(moment(newValue).format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ'));
                                setValueBegin(moment(newValue).format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ'));
                                setValueEnd(moment(newValue.toDate()));
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            ampm={false}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            label="To"
                            value={valueEnd}
                            onChange={(newValue) => {
                                setValueEnd(moment(newValue).format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ'));
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            ampm={false}
                        />
                    </LocalizationProvider>
                </div>
                <button type="submit" className="card-creator__button">Add</button>
            </form>
        </div>
    );
};

export default CardCreator;