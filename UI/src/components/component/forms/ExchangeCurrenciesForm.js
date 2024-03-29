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

const CURRENCY= [
    {
      id: 1,
      name: "BTC",
    },
    {
      id: 2,
      name: "ETH",
    },
    {
        id: 3,
        name: "USDT",
      },
      {
        id: 4,
        name: "BUSD",
      },
      {
        id: 5,
        name: "DOGE",
      },
  ];


  

const amountReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
        return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
};

  


function ExchangeCurrenciesForm() {

    const history = useHistory();
    const { isLoading, sendRequest } = useHttp(); 
   
    const [infoData, setInfoData] = useState(null);

    const [formIsValid, setFormIsValid] = useState(false);

    const [amountState, dispatchAmount] = useReducer(amountReducer, {
        value: '',
        isValid: null,
    });

   

    const authCtx = useContext(AuthContext);
    const amountInputRef = useRef();
    const currencyInputRef1 = useRef();
    const currencyInputRef2 = useRef();
    const { isValid: amountIsValid } = amountState;
  

    useEffect(() => {
        const identifier = setTimeout(() => {
            console.log('Checking form validity!');
            setFormIsValid(amountIsValid);
        }, 500);

        return () => {
            console.log('CLEANUP');
            clearTimeout(identifier);
        };
    }, [amountIsValid]);

    const amountChangeHandler = (event) => {
        dispatchAmount({ type: 'USER_INPUT', val: event.target.value });
    };

    const validateAmountHandler = () => {
        dispatchAmount({ type: 'INPUT_BLUR' });
      };


   

    function hideErrorModalHandler() {//da se ukloni prozorcic
        setInfoData(null);
    }

    function hideSuccessModalHandler() { //isto da ukloni prozor sa obavestenjem
        setInfoData(null);
        history.replace('/');
    }

    async function submitHandler(event) {
        event.preventDefault();

        if (formIsValid) {

            const requestConfig = {
                url: 'http://localhost:5000/exchanges/exchangecripto',
                method: "POST",
                body: JSON.stringify({
                    email: authCtx.user.email,
                    amount: amountState.value,
                    symbolfrom: currencyInputRef1.current.value,
                    symbolto: currencyInputRef2.current.value,

                }
                ),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authCtx.token,

                },
            };
            console.log(currencyInputRef1.current.value)
            const data = await sendRequest(requestConfig);


   
            if (data.result === 'ERROR') {
                setInfoData({
                    title: "Error",
                    message: "Error in transaction",
                });

            }
            else{
                authCtx.loading(true)
                 authCtx.addType("Kupi i zameni valute")
        let verifySocket = new WebSocket("ws://localhost:5000/exchanges/cardCryptoSocket");
       
       

        verifySocket.addEventListener('message', (event) => {
           
           
           
            if(event.data === "True"){
                authCtx.addData("Uspesno ste zamenili valute")
            }
            else{
                authCtx.addData("Neuspesno ste zamenili valute")
            }
         
        });
              
             
               
            }

        }
        else if (!amountIsValid) {
            amountInputRef.current.focus();
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
                    <Input
                        ref={amountInputRef}
                        id="from"
                        label="From:"
                        type="number"
                        isValid={amountIsValid}
                        value={amountState.value}
                        onChange={amountChangeHandler}
                        onBlur={validateAmountHandler}
                    />
                    
                    <Select
                    ref={currencyInputRef1}
                     id="currency"
                      items={CURRENCY}
                        />

                    <Select
                    ref={currencyInputRef2}
                     id="currency"
                       label="To:"
                      items={CURRENCY}
                        />

                    <div className={classes.actions}>
                        <Button type="submit" className={classes.btn}>
                            Exchange
                        </Button>
                    </div>
                </form>
            </Card>
        );
    
}

export default ExchangeCurrenciesForm;