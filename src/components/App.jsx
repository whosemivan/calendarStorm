import React, { useState, createContext } from 'react';
import browserHistory from "../browser-history";
import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';
import io from 'socket.io-client';

import Main from "../components/Main/index";
import SignIn from './SignIn';
import NotFound from "../components/NotFound/index";
import Api from "../api.js";

export const Ctx = createContext({});

const App = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") || false);
  const [refToken, setRefToken] = useState(localStorage.getItem("refreshToken"));
  const [accToken, setAccToken] = useState(localStorage.getItem("accessToken"));
  const api = new Api();

  const adminSocket = io("https://calender-storm.herokuapp.com/api/admin", {
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
    auth: { accessToken: accToken }
  });

  return (
    <Ctx.Provider value={{
      adminSocket: adminSocket, 
      setIsAuth: setIsAuth, 
      setRefToken: setRefToken,
      refToken: refToken, 
      accToken: accToken,
      setAccToken: setAccToken,
      api: api
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