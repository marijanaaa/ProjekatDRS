import React, {
    useState,
    useEffect,
    useReducer,
    useContext,
    useRef,
} from 'react';
import Card from '../card/Card';
import Button from '../button/Button';
import AuthContext from '../../../store/auth-context';
import Input from '../input/Input';
import classes from './LoginForm.module.css';
import Modal from "../modals/Modal";
import useHttp from "../../../hook/useHttp";
import { useHistory } from 'react-router-dom';
import InfModal from '../modals/InfModal';
import Select from "../input/Select";

const SORTBY= [
    {
      id: 1,
      name: "Amount",
    },
    {
      id: 2,
      name: "Date",
    },
   
  ];
  const SORT= [
    {
      id: 1,
      name: "Ascending",
    },
    {
      id: 2,
      name: "Descending",
    },
   
  ];


  






function SortForm() {

    const history = useHistory();
    const { isLoading, sendRequest } = useHttp(); 
   
    const [infoData, setInfoData] = useState(null);

    const sortInputRef = useRef();
    const sortByInputRef = useRef();


   

    const authCtx = useContext(AuthContext);
   
    
    



    function hideErrorModalHandler() {//da se ukloni prozorcic
        setInfoData(null);
    }

    function hideSuccessModalHandler() { //isto da ukloni prozor sa obavestenjem
        setInfoData(null);
       // history.replace('/');
    }

    async function submitHandler(event) {
        event.preventDefault();

       

            const requestConfig = {
                url: 'http://localhost:5000/transactions/sortTransactions',
                method: "POST",
                body: JSON.stringify({
                    email: authCtx.user.email,
                    factor: sortByInputRef.current.value, 
                  value: sortInputRef.current.value, 
                   
                  
                }
                ),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authCtx.token,

                },
            };
    
            const data = await sendRequest(requestConfig);

            
            if (data.result === 'ERROR') {//promeniti u skladu sa odg sa servera
                setInfoData({
                    title: "Error",
                    message: "Error in transaction",
                });

            }
            else {
                authCtx.getTransaction(data)
               

            }

    
        
    }

        return (
            <Card className={classes.login}>
                {isLoading && <Modal />}
                {infoData && (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Error" ? hideErrorModalHandler : hideSuccessModalHandler}
                    />
                )}
                <form onSubmit={submitHandler}>
                
                   
                <Select
                    ref={sortByInputRef}
                     id="sortBy"
                       label="Sort by:"
                      items={SORTBY}
                        />
                <Select
                    ref={sortInputRef}
                     id="sort"
                       label="Sorting method:"
                      items={SORT}
                        />
                    

                    <div className={classes.actions}>
                        <Button type="submit" className={classes.btn}>
                            Sort
                        </Button>
                    </div>
                </form>
            </Card>
        );
    
}

export default SortForm;