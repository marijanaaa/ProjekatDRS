import React, { useContext, useState, useEffect } from "react";


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
   


    return (
      


        <div>
        <div>
            <h1>Sort</h1>
            
         </div>

       <GetTransactionForm/>
         
          <SortForm/>
          <FilterForm/>
    </div>
    
            
      
    );
}

export default TransactionPage;