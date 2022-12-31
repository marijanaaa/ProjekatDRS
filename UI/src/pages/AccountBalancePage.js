import React, { useContext, useState, useEffect } from "react";
//import useHttp from "../hook/useHttp";
import Modal from "../components/component/modals/Modal";

import classes from "../components/component/forms/LoginForm.module.css";
import useHttp  from "../hook/useHttp";
import Card from "../components/component/card/Card";
import AuthContext from '../store/auth-context';
function AccountBalancePage() {

  const { isLoading, sendRequest } = useHttp();

  const [dollars, setDollars] = useState(null);
  const [BTC, setBTC] = useState(null);
  const [BUSD, setBUSD] = useState(null);
  const [DOGE, setDOGE] = useState(null);
  const [ETH, setETH] = useState(null);
   const [USDT, setUSDT] = useState(null);
  const authCtx = useContext(AuthContext);

  useEffect(() => {

  async function getCurrency() {
    const requestConfig = {
      url: 'http://localhost:5000/getAccountBalance',
      method: "POST",
      body: JSON.stringify({
        email:authCtx.user.email,
        

      }
      ),
      headers: {
        Authorization: "Bearer " + authCtx.token,

      },
     
      
    };

    //token:true-znaci da ocekuje da nam ga server napravi.

    const data = await sendRequest(requestConfig);
   
    //u data je ono sto server posalje kao odgovor(u firebase salje name)

    console.log(data)
    setDollars(data.dollars)
    setBTC(data.BTC)
    setBUSD(data.BUSD)
    setDOGE(data.DOGE)
    setETH(data.ETH)
    setUSDT(data.USDT)
      }
     getCurrency();
 





    }, [authCtx.token, sendRequest]);


  return (
    <>
    
      <h1>&nbsp;</h1>
      
      <Card className={classes.account}>
      {isLoading && <Modal/>}
        <div>
          <h1 style={{ textAlign : 'center' }}>Account balance</h1>
          
          <label>Dolars : {dollars} $</label>
          <h1>&nbsp;</h1>
         <label>Crypto currencies:</label> 
         <ul>
          <li>BTC: {BTC}</li>
          <li>BUSD: {BUSD}</li>
          <li>DOGE: {DOGE}</li> 
          <li>ETH: {ETH}</li>
          <li>USDT: {USDT}</li>
         </ul>

        
        
        </div>
      </Card>
    </>
  );
}

export default AccountBalancePage;
