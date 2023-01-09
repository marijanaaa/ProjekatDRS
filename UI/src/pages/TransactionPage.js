import React, { useContext, useState, useEffect } from "react";
import InfModal from '../components/component/modals/InfModal';
import Modal from "../components/component/modals/Modal";
import { useHistory } from 'react-router-dom';

import SortForm from "../components/component/forms/SortForm";
import FilterForm from "../components/component/forms/FilterForm";
import classes from "../components/component/forms/LoginForm.module.css";
import useHttp  from "../hook/useHttp";
import Card from "../components/component/card/Card";
import AuthContext from '../store/auth-context';
import GetTransactionForm from "../components/component/forms/GetTransactionForm";
function TransactionPage() {
    const { isLoading, sendRequest } = useHttp();
    const [dataNew, setDataNew] = useState();
    const authCtx = useContext(AuthContext);
   
    const [isLoad, setIsLoad] = useState(false);
    
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
         history.replace("/transactionInformations")
      
      }
  

    return (
      


        <div>
        <div>
            <h1>Sort</h1>
            
         </div>
         {infoData &&  (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Success" ? hideSuccessModalHandler : hideErrorModalHandler}
                    />
                )}
       <GetTransactionForm/>
         
          <SortForm/>
          <FilterForm/>
    </div>
    
            
      
    );
}

export default TransactionPage;