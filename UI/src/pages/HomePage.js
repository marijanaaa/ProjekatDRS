
import React, {useContext, useState, useEffect} from "react";
import AuthContext from '../store/auth-context';
import InfModal from '../components/component/modals/InfModal';
import Modal from "../components/component/modals/Modal";
import { useHistory } from 'react-router-dom';

import StartingPageContent from "../components/StartingPageContent/StartingPageContent";

function HomePage() {


    const [isLoad, setIsLoad] = useState(false);
    const authCtx = useContext(AuthContext);
    const [infoData, setInfoData] = useState(null);
    const history = useHistory();
   

    useEffect(() => {
        console.log(authCtx.isLoading)
    
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
    
       
      
       
      
     
    
    }, [infoData, authCtx.addData]);
    


    function hideErrorModalHandler() {//da se ukloni prozorcic
        setInfoData(null);
    }
    function hideSuccessModalHandler() { //isto da ukloni prozor sa obavestenjem
        authCtx.verify();
        setInfoData(null);
       history.replace("/")
    
    }

  return (
    <div>
       {infoData &&  (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Success" ? hideSuccessModalHandler : hideErrorModalHandler}
                    />
                )}
<StartingPageContent />
    </div>
    
  );
}

export default HomePage;