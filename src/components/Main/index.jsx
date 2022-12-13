import React, { useContext, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./style.css";
import Header from "../Header";
import Calendar from "../Calendar";
import { Ctx } from "../App";

const Main = ({ isAuth, setIsAuth, setSocket }) => {
    const { api, accToken } = useContext(Ctx);
    const [isCopy, setIsCopy] = useState(false);

    useEffect(() => {
        setSocket(api.scoket(accToken));
    }, [])

    return (
        <>
            <Header isAuth={isAuth} setIsAuth={setIsAuth} isCopy={isCopy} setIsCopy={setIsCopy} />
            <DndProvider backend={HTML5Backend}>
                <Calendar isAuth={isAuth} />
            </DndProvider>
            {
                isCopy ?
                    <div className="share-popup">
                        <button className="share-popup__btn-close" onClick={() => setIsCopy(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.2929 3.12425C23.6834 2.73372 23.6834 2.10056 23.2929 1.71004L22.29 0.707106C21.8994 0.316582 21.2663 0.316582 20.8758 0.707107L12.7071 8.87575C12.3166 9.26628 11.6834 9.26628 11.2929 8.87575L3.12425 0.707106C2.73372 0.316582 2.10056 0.316582 1.71004 0.707107L0.707106 1.71004C0.316582 2.10056 0.316582 2.73373 0.707107 3.12425L8.87575 11.2929C9.26628 11.6834 9.26628 12.3166 8.87575 12.7071L0.707106 20.8758C0.316582 21.2663 0.316582 21.8994 0.707107 22.29L1.71004 23.2929C2.10056 23.6834 2.73373 23.6834 3.12425 23.2929L11.2929 15.1242C11.6834 14.7337 12.3166 14.7337 12.7071 15.1242L20.8758 23.2929C21.2663 23.6834 21.8994 23.6834 22.29 23.2929L23.2929 22.29C23.6834 21.8994 23.6834 21.2663 23.2929 20.8758L15.1242 12.7071C14.7337 12.3166 14.7337 11.6834 15.1242 11.2929L23.2929 3.12425Z" fill="#1E1E1E" />
                            </svg>
                        </button>
                        <h2 className="share-popup__title">Link saved to clipboard</h2>
                        <svg width="67" height="78" viewBox="0 0 67 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M49.3684 0H7.05263C3.17368 0 0 3.19091 0 7.09091V56.7273H7.05263V7.09091H49.3684V0ZM59.9474 14.1818H21.1579C17.2789 14.1818 14.1053 17.3727 14.1053 21.2727V70.9091C14.1053 74.8091 17.2789 78 21.1579 78H59.9474C63.8263 78 67 74.8091 67 70.9091V21.2727C67 17.3727 63.8263 14.1818 59.9474 14.1818ZM59.9474 70.9091H21.1579V21.2727H59.9474V70.9091Z" fill="black" />
                        </svg>

                    </div> : ""
            }

        </>
    );
};

export default Main;