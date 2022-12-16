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
            <Button>Logout</Button>
            </li>
          )}
        </ul>
      </nav>
    );
}

export default MainNavigation;