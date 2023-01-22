


import React, {useContext, useState, useEffect} from "react";

import InfModal from '../components/component/modals/InfModal';

import { useHistory } from 'react-router-dom';
import Modal from "../components/component/modals/Modal";

import classes from "../components/component/forms/LoginForm.module.css";
import useHttp  from "../hook/useHttp";
import Card from "../components/component/card/Card";
import AuthContext from '../store/auth-context';
function AccountBalancePage() {

  const { isLoading, sendRequest } = useHttp();
  const [isLoad, setIsLoad] = useState(false);
 
  const [infoData, setInfoData] = useState(null);
  const history = useHistory();
  const [dollars, setDollars] = useState(null);
  const [BTC, setBTC] = useState(null);
  const [BUSD, setBUSD] = useState(null);
  const [DOGE, setDOGE] = useState(null);
  const [ETH, setETH] = useState(null);
   const [USDT, setUSDT] = useState(null);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if(authCtx.isLoading){
         
      setIsLoad(true)
      if(authCtx.data === "Prenos para uspeo"){
         
          authCtx.loading(false)
          setIsLoad(false)
          setInfoData({
              title: "Success",
              message:" Transaction sucessed" ,
          });
             authCtx.addData("nije")
      }
      if(authCtx.data === "Prenos para nije uspeo") {
          authCtx.loading(false)
          setIsLoad(false)
          setInfoData({
              title: "Error",
              message:" Transaction denied" ,
          });
          authCtx.addData("nije")
      }
      if(authCtx.data === "Verifikacija uspela"){
         
          authCtx.loading(false)
          setIsLoad(false)      
       setInfoData({
      title:  "Success",
      message: "1$ has been successfully deducted from your card!",
    });
          authCtx.addData("nije")
         
      }
      if(authCtx.data === "Verifikacija nije uspela"){
         
          authCtx.loading(false)
          setIsLoad(false)
          setInfoData({
              title:  "Error",
              message: "Card does not exist! ",
            });
          authCtx.addData("nije")
      }
     
      if(authCtx.data === "Uplata dolara na svoj racun"){
         
        authCtx.loading(false)
        setIsLoad(false)  
     setInfoData({
    title:  "Success",
    message: "Money successfully paid into the account!",
  });
        authCtx.addData("nije")
       
    }
    if(authCtx.data === "Uplata na svoj racun nije uspela"){
         
        authCtx.loading(false)
        setIsLoad(false) 
     setInfoData({
    title:  "Error",
    message: "Money successfully paid into the account!",
  });
        authCtx.addData("nije")
       
    }
    if(authCtx.data === "Uspesno ste kupili dolare"){
         
        authCtx.loading(false)
        setIsLoad(false)
       
        setInfoData({
            title: "Success",
            message: "You buy criptocurrencies!",
        });
       
           authCtx.addData("nije")
    }
    if(authCtx.data === "Neuspesno ste kupili dolare") {
        authCtx.loading(false)
        setIsLoad(false)
      
            setInfoData({
                title: "Success",
                message: "Payment error!",
            });
           

        authCtx.addData("nije")
    }
    if(authCtx.data === "Uspesno ste zamenili valute"){
         
        authCtx.loading(false)
        setIsLoad(false)
       
        setInfoData({
            title: "Success",
            message: "You change criptocurrencies!",
        });
       
           authCtx.addData("nije")
    }
    if(authCtx.data === "Neuspesno ste zamenili valute") {
        authCtx.loading(false)
        setIsLoad(false)
      
            setInfoData({
                title: "Success",
                message: "Error in exchange criptocurrencies!",
            });
           

        authCtx.addData("nije")
    }
   }
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


    const data = await sendRequest(requestConfig);
    if(data.result === 'Can not load account balance from this user'){
      setInfoData({
        title: "Error",
        message: "Can not load account balance from this user",
      });
     
     }
   

    console.log(data)
    setDollars(data.dollars)
    setBTC(data.BTC)
    setBUSD(data.BUSD)
    setDOGE(data.DOGE)
    setETH(data.ETH)
    setUSDT(data.USDT)
      }
     getCurrency();
 





    }, [authCtx.token, sendRequest, infoData, authCtx.addData]);

    function hideErrorModalHandler() {
      setInfoData(null);
  }
  function hideSuccessModalHandler() { 
    authCtx.verify();
    setInfoData(null);
     history.replace("/balance")
  
  }

  return (
    <>
    
      <h1>&nbsp;</h1>
      
      <Card className={classes.account}>
      {isLoading && <Modal/>}
      {infoData &&  (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Success" ? hideSuccessModalHandler : hideErrorModalHandler}
                    />
                )}
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
