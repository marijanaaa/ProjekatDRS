
import React, { useContext, useState, useEffect } from "react";
import './App.css';
import classes from './LoginForm.module.css';
import useHttp from "../../../hook/useHttp";
import Card from '../card/Card';
import AuthContext from '../../../store/auth-context';



function GetTransactionForm(){

    const { isLoading, sendRequest } = useHttp();
  
const [dataNew, setDataNew] = useState();


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
      //console.log(data)
      authCtx.getTransaction(data)
     // console.log(authCtx.transaction)



     
  
      
     // console.log(data[0])
     // const dictionary = data.result.reduce((obj, item)=>{
     //   
   
     // })
   
     // Object.entries(data)
      //.map( ([key, value]) => `My key is ${key} and my value is ${value}` )
   
      
      //u data je ono sto server posalje kao odgovor(u firebase salje name)
  
    }
       getTransaction();
   
 
  
  
  
  
      }, [authCtx.token, sendRequest]);
      
    }
   
    export default GetTransactionForm;