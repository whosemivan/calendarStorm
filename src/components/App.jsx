import React, { useState } from 'react';
import browserHistory from "../browser-history";
import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';

import Main from "../components/Main/index";
import SignIn from './SignIn';
import NotFound from "../components/NotFound/index";

const App = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") || false);

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