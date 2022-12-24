import { Route, Switch, Redirect } from "react-router-dom";

import MainHeader from "./components/layout/MainHeader";
import React, {useContext} from "react";
import LoginPage from "./pages/LoginPage";
import AuthContext from "./store/auth-context";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import AccountBalancePage from "./pages/AccountBalancePage";

import ProfilePage from "./pages/ProfilePage";
function App() {
  const ctx = useContext(AuthContext);
  //const userIsAdmin = ctx.user !== null && ctx.user.userType === "ADMIN";
  return (
    <React.Fragment>
      <MainHeader />
      <Switch>
       <Route path="/" exact>
          <HomePage />
        </Route>

        <Route path="/login">
          {!ctx.isLoggedIn && <LoginPage />}
          {ctx.isLoggedIn && <Redirect to="/" />}
        </Route>
       
        <Route path="/registration">
        {!ctx.isLoggedIn && <RegistrationPage />}
          {ctx.isLoggedIn && <Redirect to="/" />}
        </Route>
       
        <Route path="/profile">
        {ctx.isLoggedIn && <ProfilePage />}
          {!ctx.isLoggedIn && <Redirect to="/" />}
        </Route>

        <Route path="/balance">
        {ctx.isLoggedIn && <AccountBalancePage />}
          {!ctx.isLoggedIn && <Redirect to="/" />}
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
