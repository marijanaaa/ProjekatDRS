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




  






function TransactionForm() {

    const history = useHistory();
    const { isLoading, sendRequest } = useHttp(); 
   
    const [infoData, setInfoData] = useState(null);

    let sortBy  = ['Amount', 'Date'];
    let sort  = ['Ascending', 'Descending'];


    const [factor, setFactor] = useState(null)
    const [value, setValue] = useState(null)

    const authCtx = useContext(AuthContext);
   
    
    



    function hideErrorModalHandler() {//da se ukloni prozorcic
        setInfoData(null);
    }

    function hideSuccessModalHandler() { //isto da ukloni prozor sa obavestenjem
        setInfoData(null);
        history.replace('/');
    }

    async function submitHandler(event) {
        event.preventDefault();

       

            const requestConfig = {
                url: 'http://localhost:5000/newTransaction',
                method: "POST",
                body: JSON.stringify({
                    email: authCtx.user.email,
                    factor: factor, 
                  value: value, 
                   
                  
                }
                ),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authCtx.token,

                },
            };
    
            const data = await sendRequest(requestConfig);

             console.log(data)
            if (data.result === 'ERROR') {//promeniti u skladu sa odg sa servera
                setInfoData({
                    title: "Error",
                    message: "Error in transaction",
                });

            }
            else {
                setInfoData({
                    title: "Success",
                    message: "Succesfuly send!",
                });

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
                
                   
                    
                <combobox
                data={sortBy}
                value={factor}
               onChange={factor => setFactor(factor)}
                 />
                 <combobox
                data={sort}
                value={value}
               onChange={value => setValue(value)}
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

export default TransactionForm;