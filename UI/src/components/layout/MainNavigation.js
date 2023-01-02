import {useContext} from 'react';
import Button from '../component/button/Button';
import AuthContext from '../../store/auth-context';
import {Link} from 'react-router-dom';
import classes from './MainNavigation.module.css';

function MainNavigation() {
    const ctx = useContext(AuthContext);
   // const userIsAdmin = ctx.user !== null && ctx.user.userType === "ADMIN";
    return (
      <nav className={classes.nav}>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
         
          {!ctx.isLoggedIn && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          {!ctx.isLoggedIn && (
            <li>
              <Link to="/registration">Registration</Link>
            </li>
          )}
        
        {ctx.isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
        )}

        {ctx.isLoggedIn && (
            <li>
              <Link to="/edit">Change Profile</Link>
            </li>
        )}

        {ctx.isLoggedIn && (
            <li>
              <Link to="/balance">Account Balance</Link>
            </li>
        )}
         

         {!ctx.isVerify && ctx.isLoggedIn && (
            <li>
              <Link to="/verification">Verification</Link>
            </li>
        )}
        {ctx.isVerify && ctx.isLoggedIn && (
            <li>
              <Link to="/pay">Pay from card</Link>
            </li>
        )}

          {ctx.isLoggedIn && (
            <li>
             <Button onClick={ctx.logout}>Logout</Button>
            </li>
          )}
        </ul>
      </nav>
    );
}

export default MainNavigation;