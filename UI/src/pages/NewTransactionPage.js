import React, {useContext, useState, useEffect} from "react";
import AuthContext from '../store/auth-context';
import InfModal from '../components/component/modals/InfModal';
import Modal from "../components/component/modals/Modal";
import { useHistory } from 'react-router-dom';

import NewTransactionForm from "../components/component/forms/NewTransactionForm";

function NewTransactionPage() {
    const [isLoad, setIsLoad] = useState(false);
    const authCtx = useContext(AuthContext);
    const [infoData, setInfoData] = useState(null);
    const history = useHistory();
   

    useEffect(() => {
      console.log(authCtx.isLoading)

     
      if(authCtx.isLoading){
        if(authCtx.transactionType === "Posalji drugom korisniku"){
            setIsLoad(true)
        }
     
      
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
    message: "Error in payment $!!",
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
                title: "Error",
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
                title: "Error",
                message: "Error in exchange criptocurrencies!",
            });
           

        authCtx.addData("nije")
    }
   }

   
   

}, [infoData, authCtx.addData]);




    function hideErrorModalHandler() {//da se ukloni prozorcic
        setInfoData(null);
    }
    function hideSuccessModalHandler() { 
       
        setInfoData(null);
       history.replace("/balance")
    
    }

    return (
      


        <div>
        <div>
            <h1>Transaction</h1>
            
         </div>
         {(isLoad) && <Modal />}
         {infoData &&  (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Success" ? hideSuccessModalHandler : hideErrorModalHandler}
                    />
                )}
         <NewTransactionForm/>
          
    </div>
    
            
      
    );
}

export default NewTransactionPage;