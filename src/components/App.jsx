import React, { useState, createContext } from 'react';
import { parse } from "../utils";
import browserHistory from "../browser-history";
import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';

import Main from "../components/Main/index";
import SignIn from './SignIn';
import SignUp from './SignUp';
import NotFound from "../components/NotFound/index";
import Api from "../api.js";

export const Ctx = createContext({});

const App = () => {
  const [refToken, setRefToken] = useState(localStorage.getItem("refreshToken"));
  const [accToken, setAccToken] = useState(localStorage.getItem("accessToken"));
  const [isAuth, setIsAuth] = useState(parse(localStorage.getItem("isAuth")) && accToken ? true : false);
  const [socket, setSocket] = useState();
  const [access, setAccess] = useState(false);
  const [calendarName, setCalendarName] = useState();
  const [calendarId, setCalendarId] = useState();
  const api = new Api();


  return (
    <Ctx.Provider value={{
      socket: socket,
      setIsAuth: setIsAuth,
      setRefToken: setRefToken,
      refToken: refToken,
      accToken: accToken,
      setAccToken: setAccToken,
      access: access,
      setAccess: setAccess,
      calendarName: calendarName,
      setCalendarName: setCalendarName,
      calendarId: calendarId,
      setCalendarId: setCalendarId,
      api: api
    }}>
      <BrowserRouter history={browserHistory}>
        <Switch>
          <Route exact path='/'>
            <SignIn setIsAuth={setIsAuth} isAuth={isAuth} />
          </Route>
          <Route exact path='/signup'>
            <SignUp setIsAuth={setIsAuth} isAuth={isAuth} />
          </Route>
          <Route exact path='/calendar/*'>
            <Main isAuth={isAuth} setIsAuth={setIsAuth} setSocket={setSocket} />
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