import React, { useContext, useState, useEffect } from "react";


import SortForm from "../components/component/forms/SortForm";
import FilterForm from "../components/component/forms/FilterForm";
import classes from "../components/component/forms/LoginForm.module.css";
import useHttp  from "../hook/useHttp";
import Card from "../components/component/card/Card";
import AuthContext from '../store/auth-context';
function TransactionPage() {
    const { isLoading, sendRequest } = useHttp();
    const authCtx = useContext(AuthContext);
    useEffect(() => {

        async function getTransaction() {
          const requestConfig = {
            url: 'http://localhost:5000/getTransactions',
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
      
        }
           getTransaction();
       
      
      
      
      
      
          }, [authCtx.token, sendRequest]);
      
      



    return (
      


        <div>
        <div>
            <h1>Sort</h1>
            
         </div>

         <div>
            
         </div>
         <SortForm/>
         <FilterForm/>
          
    </div>
    
            
      
    );
}

export default TransactionPage;