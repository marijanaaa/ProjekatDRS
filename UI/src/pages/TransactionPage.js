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
                 <div className="App">
      <table>
        <tr>
          <th>Sender</th>
          <th>Receiver</th>
          <th>Amount</th>
          <th>Criptocurrency</th> 
          <th>Date</th>
        </tr>
       
        {Object.entries(authCtx.transaction)
           .map( ([key, value]) => <tr> <td>{value.sender}</td> <td>{value.receiver}</td> <td>{value.amount} </td> <td>{value.cryptocurrency}</td>  <td>{value.date}</td></tr> )}
        
      </table>
    </div>   
     
     
      
        
        
          
        
       <GetTransactionForm/>
         
          <SortForm/>
          <FilterForm/>
    </div>
    
            
      
    );
}

export default TransactionPage;