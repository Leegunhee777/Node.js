import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { withCookies, useCookies} from 'react-cookie';
import Login from './Components/Login';
import Join from './Components/Join';
import Todo from './Components/Todo';

const App = () => {

  const [ cookies, removeCookie ] = useCookies(['user']);
  const [ hasCookie, setHasCookie ] = useState(false);
  
  useEffect(() => {
    if(cookies.user && cookies.user !== 'undefined'){
      setHasCookie(true);
      
      }
  }, [cookies]);

return (
  <div className = "App">
    <h1>Todo App</h1>
    
    <br/>
    {!hasCookie ? <Redirect to = "/login"/> : <Redirect to = "/todo"/>}

    <Switch>
      <Route
        exact path = "/login"
        render={routerProps => {
          return (
            <Login
              {...routerProps}
              setHasCookie={setHasCookie}
              />
          );
        }}
      />

      <Route
        exact path ="/join"
        component ={Join}
      />

      <Route
        exact path ="/todo"
        render = {routerProps => {
          return (
            <Todo
              {...routerProps}
              cookies  =  {cookies.user}
              hasCookie ={hasCookie}
              setHasCookie ={setHasCookie}
              removeCookie={()=> {
                removeCookie('user');
                setHasCookie(false);
              }}
      />
          );
        }}
      />
    </Switch>
  </div>
)
}

export default withCookies(App);