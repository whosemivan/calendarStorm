class Api {
    constructor() {
        this.url = "https://calender-storm.herokuapp.com/api/"

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
}

export default Api;