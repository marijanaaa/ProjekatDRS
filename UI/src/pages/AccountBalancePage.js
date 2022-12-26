import React, { useContext } from "react";
//import useHttp from "../hook/useHttp";
//import Modal from "../components/component/modals/Modal";

import classes from "../components/component/forms/LoginForm.module.css";

import Card from "../components/component/card/Card";
import AuthContext from '../store/auth-context';
function AccountBalancePage() {
  const authCtx = useContext(AuthContext);
 

 
  

  return (
    <>
    
      <h1>&nbsp;</h1>

      <Card className={classes.account}>
        <div>
          <h1 style={{ textAlign : 'center' }}>Account balance</h1>
          
          <label>Dolars : {authCtx.user.balanceInDollars} $</label>
          <h1>&nbsp;</h1>
         <label>Crypto currencies:</label> 

         <div>
          {
           Object.entries(authCtx.user.cryptocurrencies)
            .map( ([key, value]) => <li>{key} : {value}</li> )
         }
  </div>
        
        </div>
      </Card>
    </>
  );
}

export default AccountBalancePage;
