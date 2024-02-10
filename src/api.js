import io from 'socket.io-client';
import browserHistory from './browser-history';

class Api {
    constructor() {
        this.url = "http://141.8.194.179/api/"
    }

    logIn(body) {
        return fetch(`${this.url}auth/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }
    signUp(body) {
        return fetch(`${this.url}auth/register`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }

    refresh(body) {
        return fetch(`${this.url}auth/refresh`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }

    socket(accessToken) {
        const socketUrl = this.url + (accessToken ? "admin" : "user");
        const options = {
            transports: ["websocket"],
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000
        }
        const calendarId = window.location.pathname.split("/")[2];

        if (accessToken || calendarId) {
            options.auth = { accessToken, calendarId };
        } else {
            browserHistory.push("/notFound")
        }

        return io(socketUrl, options);
    }
}

export default Api;
