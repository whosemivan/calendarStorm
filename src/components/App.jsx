import React, { useState, useEffect } from 'react';
import browserHistory from "../browser-history";
import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';
import io from 'socket.io-client';

import Main from "../components/Main/index";
import SignIn from './SignIn';
import NotFound from "../components/NotFound/index";

const App = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") || false);



  const socket = io("https://calender-storm.herokuapp.com/api/", { transports: ["websocket"] });

  // Это штука получает ответ от сервера. После загрузки страницы мы получим ответ от сервера с карточками событий на этот месяц.

  useEffect(() => {
    socket.on("events:get", (data) => {
      console.log(data);
      console.log('there');
    });
  }, []);


  // Запрос для получения карточек событий на следующий месяц.

  function getEvents() {
    socket.emit("events:get", 1);
  }

  getEvents();


  return (
    <BrowserRouter history={browserHistory}>
      <Switch>
        <Route exact path='/'>
          <SignIn setIsAuth={setIsAuth} isAuth={isAuth} />
        </Route>
        <Route exact path='/calendar/1'>
          <Main isAuth={isAuth} setIsAuth={setIsAuth} />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;