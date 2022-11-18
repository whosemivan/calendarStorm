import React from 'react';
import browserHistory from "../browser-history";
import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';

import Main from "../components/Main/index";
import SignIn from "../components/SignIn/index";
import NotFound from "../components/NotFound/index";

const App = () => {
  return (
    <BrowserRouter history={browserHistory}>
      <Switch>
        <Route exact path='/'>
          <Main/>
        </Route>
        <Route exact path='/signin'>
          <SignIn/>
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;