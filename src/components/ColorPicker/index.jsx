import React from "react";
import "./style.css";

// Компонент для выбора цвета ивента в попапе создания и изменения

const ColorPicker = ({ setColor, setIsVisible }) => {
    return (
        <div className="color-picker">
            <button className="color-picker__close-btn" onClick={() => setIsVisible(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.2929 3.12425C23.6834 2.73372 23.6834 2.10056 23.2929 1.71004L22.29 0.707106C21.8994 0.316582 21.2663 0.316582 20.8758 0.707107L12.7071 8.87575C12.3166 9.26628 11.6834 9.26628 11.2929 8.87575L3.12425 0.707106C2.73372 0.316582 2.10056 0.316582 1.71004 0.707107L0.707106 1.71004C0.316582 2.10056 0.316582 2.73373 0.707107 3.12425L8.87575 11.2929C9.26628 11.6834 9.26628 12.3166 8.87575 12.7071L0.707106 20.8758C0.316582 21.2663 0.316582 21.8994 0.707107 22.29L1.71004 23.2929C2.10056 23.6834 2.73373 23.6834 3.12425 23.2929L11.2929 15.1242C11.6834 14.7337 12.3166 14.7337 12.7071 15.1242L20.8758 23.2929C21.2663 23.6834 21.8994 23.6834 22.29 23.2929L23.2929 22.29C23.6834 21.8994 23.6834 21.2663 23.2929 20.8758L15.1242 12.7071C14.7337 12.3166 14.7337 11.6834 15.1242 11.2929L23.2929 3.12425Z" fill="#1E1E1E" />
                </svg>
            </button>
            <button style={{
                backgroundColor: '#F7D1D3'
            }} className="color-picker__color" onClick={(evt) => {
                setColor('F7D1D3');
                evt.preventDefault();
                setIsVisible(false);
            }}></button>
            <button style={{
                backgroundColor: '#E9C1E6'
            }} className="color-picker__color" onClick={(evt) => {
                setColor('E9C1E6');
                evt.preventDefault();
                setIsVisible(false);
            }}></button>
            <button style={{
                backgroundColor: '#CCBBEC'
            }} className="color-picker__color" onClick={(evt) => {
                setColor('CCBBEC');
                evt.preventDefault();
                setIsVisible(false);
            }}></button>
            <button style={{
                backgroundColor: '#AAC3F0'
            }} className="color-picker__color" onClick={(evt) => {
                setColor('AAC3F0');
                evt.preventDefault();
                setIsVisible(false);
            }}></button>
            <button style={{
                backgroundColor: '#A1D9F1'
            }} className="color-picker__color" onClick={(evt) => {
                setColor('A1D9F1');
                evt.preventDefault();
                setIsVisible(false);
            }}></button>
            <button style={{
                backgroundColor: '#A5EAF3'
            }} className="color-picker__color" onClick={(evt) => {
                setColor('A5EAF3');
                evt.preventDefault();
                setIsVisible(false);
            }}></button>
            <button style={{
                backgroundColor: '#ADF3E2'
            }} className="color-picker__color" onClick={(evt) => {
                setColor('ADF3E2');
                evt.preventDefault();
                setIsVisible(false);
            }}></button>
            <button style={{
                backgroundColor: '#C8F9C5'
            }} className="color-picker__color" onClick={(evt) => {
                setColor('C8F9C5');
                evt.preventDefault();
                setIsVisible(false);
            }}></button>
        </div>
    );
};

export default ColorPicker;