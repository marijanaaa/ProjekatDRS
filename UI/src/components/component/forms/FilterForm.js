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


const minReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: true };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: true };
    }
    return { value: '', isValid: true };
  };
  
  const maxReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: true };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: true };
    }
    return { value: '', isValid: true };
  };
  const dateReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: true };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: true };
    }
    return { value: '', isValid: true };
  };



  const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.includes('@') };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.includes('@') };
    }
    return { value: '', isValid: true };
  };


function FilterForm() {

    const history = useHistory();
    const { isLoading, sendRequest } = useHttp(); 
   
    const [infoData, setInfoData] = useState(null);

   

    const [dateState, dispatchDate] = useReducer(dateReducer, {
        value: '',
        isValid: true,
    });
   
    const [minState, dispatchMin] = useReducer(minReducer, {
        value: '',
        isValid: true,
    });
    const [maxState, dispatchMax] = useReducer(maxReducer, {
        value: '',
        isValid: true,
    });
    const [emailState, dispatchEmail] = useReducer(emailReducer, {
        value: '',
        isValid: true,
      });
    const authCtx = useContext(AuthContext);
    const dateInputRef = useRef();
    const minInputRef = useRef();
     const maxInputRef = useRef();
     const emailInputRef = useRef();

    const { isValid: dateIsValid } = dateState;
 const { isValid: minIsValid } = minState;
 const { isValid: maxIsValid } = maxState;
 const { isValid: emailIsValid } = emailState;
    
    
    const dateChangeHandler = (event) => {
        dispatchDate({ type: 'USER_INPUT', val: event.target.value });
    };

    const validateDateHandler = () => {
        dispatchDate({ type: 'INPUT_BLUR' });
      };


      const minChangeHandler = (event) => {
        dispatchMin({ type: 'USER_INPUT', val: event.target.value });
    };

    const validateMinHandler = () => {
        dispatchDate({ type: 'INPUT_BLUR' });
      };



      const maxChangeHandler = (event) => {
        dispatchMax({ type: 'USER_INPUT', val: event.target.value });
    };

    const validateMaxHandler = () => {
        dispatchMax({ type: 'INPUT_BLUR' });
      };

      const emailChangeHandler = (event) => {
     
         dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
     
      
       };
       const validateEmailHandler = () => {
        dispatchEmail({ type: 'INPUT_BLUR' });
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

       

            const requestConfig = {
                url: 'http://localhost:5000/transactions/filterTransactions',
                method: "POST",
                body: JSON.stringify({
                    email: authCtx.user.email,
                    date: dateState.value, 
                    min: minState.value, 
                    max: maxState.value, 
                    recvEmail: emailState.value,
                  
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
              console.log(data)
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
                
                <Input
                        ref={dateInputRef}
                        id="date"
                        label="Date:"
                        type="date"
                        isValid={dateIsValid}
                        value={dateState.value}
                        onChange={dateChangeHandler}
                        onBlur={validateDateHandler}
                    />
 
 <Input
            ref={emailInputRef}
            id="email"
            label="E-Mail"
            type="email"
            isValid={emailIsValid}
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
                  <label>     AMOUNT    </label>
                 <Input
                        ref={minInputRef}
                        id="min"
                        label="min:"
                        type="number"
                        isValid={minIsValid}
                        value={minState.value}
                        onChange={minChangeHandler}
                        onBlur={validateMinHandler}
                    />

 
                  <Input
                        ref={maxInputRef}
                        id="max"
                        label="max:"
                        type="number"
                        isValid={maxIsValid}
                        value={maxState.value}
                        onChange={maxChangeHandler}
                        onBlur={validateMaxHandler}
                    />
  
                   
               
                    <div className={classes.actions}>
                        <Button type="submit" className={classes.btn}>
                        Filter
                        </Button>
                    </div>
                </form>
            </Card>
        );
    
}

export default FilterForm;