import React, { useContext } from "react";
//import useHttp from "../hook/useHttp";
//import Modal from "../components/component/modals/Modal";

import classes from "../components/component/forms/LoginForm.module.css";

import Card from "../components/component/card/Card";
import AuthContext from '../store/auth-context';
function AccountBalancePage() {
  const authCtx = useContext(AuthContext);
  
   // const { isLoading, sendRequest } = useHttp();
//[] znaci da ce fja da menja vrednost
//{} znaci da ce vr da se menja kad se pozove fja
   // const authCtx = useContext(AuthContext);
   // const requestConfig = {
      //  url: "https://localhost:5000/balance",
       
      //  headers: {
      //    Authorization: "Bearer " + authCtx.token,
        //},
     // };
     // const data = sendRequest(requestConfig);
      //u data je odg
     // console.log(data);

    //get 
    
   //let vr = data.ballanceInDollars
    //setAccountBalance(1000);
    //console.log(accountBalance)

    //lista sa map

 //   let accountBalance = 0
  return (
    <>
    
      <h1>&nbsp;</h1>

      <Card className={classes.account}>
        <div>
          <h1 style={{ textAlign : 'center' }}>Account balance</h1>
          
          <label>Dolars:{authCtx.user.balanceInDollars} $</label>
          <h1>&nbsp;</h1>
         <label>Kripto valute:</label> 
          <ul>
            {authCtx.user.cryptocurrencies.map(valuta =>
              <li>Valuta: {valuta}</li>
            )}
            
          </ul>
        </div>
      </Card>
    </>
  );
}

export default AccountBalancePage;
