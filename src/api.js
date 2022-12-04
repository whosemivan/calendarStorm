class Api {
    constructor() {
        this.url = "https://calendar-storm.onrender.com/api/"

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
}

export default Api;
