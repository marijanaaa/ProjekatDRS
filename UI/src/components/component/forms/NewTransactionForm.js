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

const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.includes('@') };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.includes('@') };
    }
    return { value: '', isValid: false };
  };


function NewTransactionForm() {

    const history = useHistory();
    const { isLoading, sendRequest } = useHttp(); 
    const [isLoad, setIsLoad] = useState(false);
   
    const [IsL, setL] = useState(false)
    const [infoData, setInfoData] = useState(null);

    const [formIsValid, setFormIsValid] = useState(false);

    const [amountState, dispatchAmount] = useReducer(amountReducer, {
        value: '',
        isValid: null,
    });
    const [emailState, dispatchEmail] = useReducer(emailReducer, {
        value: '',
        isValid: null,
      });
   

    const authCtx = useContext(AuthContext);
    const amountInputRef = useRef();
    const emailInputRef = useRef();
    const currencyInputRef1 = useRef();
   
    const { isValid: amountIsValid } = amountState;
    const { isValid: emailIsValid } = emailState;

    useEffect(() => {
      
        
        const identifier = setTimeout(() => {
            console.log('Checking form validity!');
            setFormIsValid(amountIsValid, emailIsValid);

        }, 500);


         

        return () => {
            console.log('CLEANUP');
            clearTimeout(identifier);
        };
    }, [amountIsValid, emailIsValid]);

    const amountChangeHandler = (event) => {
        dispatchAmount({ type: 'USER_INPUT', val: event.target.value });
    };
    const emailChangeHandler = (event) => {
        // console.log(event.target.value);
         dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
     
         // setFormIsValid(
         //   event.target.value.includes('@') && passwordState.isValid
         // );
       };

    const validateAmountHandler = () => {
        dispatchAmount({ type: 'INPUT_BLUR' });
      };
      const validateEmailHandler = () => {
        dispatchEmail({ type: 'INPUT_BLUR' });
      };
  

   

    function hideErrorModalHandler() {
        setInfoData(null);
    }

    function hideSuccessModalHandler() { 
        setInfoData(null);
        history.replace('/');
    }

    async function submitHandler(event) {

        event.preventDefault();

        if (formIsValid) {

            const requestConfig = {
                url: 'http://localhost:5000/transactions/newTransaction',
                method: "POST",
                body: JSON.stringify({
                    sender_email: authCtx.user.email,
                    receiver_email: emailState.value,
                    amount: amountState.value,
                    cryptocurrency: currencyInputRef1.current.value,
                  
                }
                ),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authCtx.token,

                },
            };
    
            const data = await sendRequest(requestConfig);

             
            if (data.result === 'ERROR') {
                setInfoData({
                    title: "Error",
                    message: "Error in transaction",
                });

            }
            else{
                authCtx.loading(true)
                authCtx.addType("Posalji drugom korisniku")
        let verifySocket = new WebSocket("ws://localhost:5000/transactions/verifysocket");
       
       

        verifySocket.addEventListener('message', (event) => {
           
           
           
            if(event.data === "True"){
                authCtx.addData("Prenos para uspeo")
            }
            else{
                authCtx.addData("Prenos para nije uspeo")
            }
         
        });
              
             
               
            }
           
           
             
            

           
           

        }
        else if (!amountIsValid) {
            amountInputRef.current.focus();
        }
        else if (!emailIsValid) {
            emailInputRef.current.focus();
        }
      
    }

   
   //if(authCtx.isLoading){//da kad ode na drugu stranicu i vrati se i dalje se vrti krug
    // setIsLoad(true)
  // }
   
   
    
   
        return (
            <Card className={classes.login}>
                
                {isLoading && <Modal />}
                {infoData &&  (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Error" ? hideErrorModalHandler : hideSuccessModalHandler}
                    />
                )}
                <form onSubmit={submitHandler}>
                <Input
                        ref={emailInputRef}
                        id="email"
                        label="Email:"
                        type="email"
                        isValid={emailIsValid}
                        value={emailState.value}
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                    />
                    <Input
                        ref={amountInputRef}
                        id="from"
                        label="Amount:"
                        type="number"
                        isValid={amountIsValid}
                        value={amountState.value}
                        onChange={amountChangeHandler}
                        onBlur={validateAmountHandler}
                    />
                    
                    <Select
                    ref={currencyInputRef1}
                     id="currency"
                       label="Currency:"
                      items={CURRENCY}
                        />

                    

                    <div className={classes.actions}>
                        <Button type="submit" className={classes.btn}>
                            Send
                        </Button>
                    </div>
                </form>
            </Card>
        );
    
}

export default NewTransactionForm;