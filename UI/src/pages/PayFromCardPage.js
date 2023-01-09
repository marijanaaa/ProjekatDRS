import React, {useContext, useState, useEffect} from "react";
import AuthContext from '../store/auth-context';
import InfModal from '../components/component/modals/InfModal';
import Modal from "../components/component/modals/Modal";
import { useHistory } from 'react-router-dom';


import PayFromCardForm from "../components/component/forms/PayFromCardForm";

function PayFromCardPage() {
    const [isLoad, setIsLoad] = useState(false);
    const authCtx = useContext(AuthContext);
    const [infoData, setInfoData] = useState(null);
    const history = useHistory();
   
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
       
      
     
  
  }, [infoData, authCtx.addData]);
  
  
  
  
      function hideErrorModalHandler() {//da se ukloni prozorcic
          setInfoData(null);
      }
      function hideSuccessModalHandler() { //isto da ukloni prozor sa obavestenjem
          setInfoData(null);
         history.replace("/cardTransaction")
      
      }
  
    
        
  
  
    return (
      


        <div>
        <div>
            <h1>Pay</h1>
            
         </div>
         {infoData &&  (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Success" ? hideSuccessModalHandler : hideErrorModalHandler}
                    />
                )}
         <PayFromCardForm/>
          
    </div>
    
            
      
    );
}

export default PayFromCardPage;