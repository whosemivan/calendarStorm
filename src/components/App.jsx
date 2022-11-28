import React, { useState, createContext } from 'react';
import browserHistory from "../browser-history";
import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';
import io from 'socket.io-client';

import Main from "../components/Main/index";
import SignIn from './SignIn';
import NotFound from "../components/NotFound/index";

export const Ctx = createContext({});

const App = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") || false);

  const adminSocket = io("https://calender-storm.herokuapp.com/api/admin", {
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
    auth: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzdhMDUxMmUwOWU5NzA2ZjQ5ZmVlOTUiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjY5NDc0NzMwLCJleHAiOjE2Njk3MzM5MzB9.5a9iZKjeXXmnqSKUWo394a9MQYtOtBcNBqLErlXwEUM" }
  });

  return (
    <Ctx.Provider value={{
      adminSocket: adminSocket
    }}>
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
    </Ctx.Provider>
  );
};

export default App;