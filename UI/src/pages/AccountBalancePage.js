


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



    console.log(authCtx.isLoading)

    if(authCtx.isLoading){
      
       setIsLoad(true)
       if(authCtx.data){
          
           authCtx.loading(false)
           setIsLoad(false)
           setInfoData({
               title: "Success",
               message:" Transaction sucessed" ,
           });
          // authCtx.loading(false)
          
         
             
              // history.replace("/");
           
              authCtx.addData(false)
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
 





    }, [authCtx.token, sendRequest, infoData, authCtx.addData]);

    function hideErrorModalHandler() {//da se ukloni prozorcic
      setInfoData(null);
  }
  function hideSuccessModalHandler() { //isto da ukloni prozor sa obavestenjem
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
