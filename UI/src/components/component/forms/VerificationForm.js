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
  const numberReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0  };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0};
    }
    return { value: '', isValid: false };
  };
  
  const nameReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
  };


  const dateReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
  };
  
  const codeReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
  };
  
  const VerificationForm = (props) => {
    
    
    const { isLoading, sendRequest } = useHttp();
    
    const [infoData, setInfoData] = useState(null);//da ispise sta se desilo

    const [formIsValid, setFormIsValid] = useState(false);
  
    
    
    


   
     
  
    

    const [numberState, dispatchNumber] = useReducer(numberReducer, {
      value: '',
      isValid: null,
    });
    const [nameState, dispatchName] = useReducer(nameReducer, {
      value: '',
      isValid: null,
    });
    const [dateState, dispatchDate] = useReducer(dateReducer, {
        value: '',
        isValid: null,
      });
  
      const [codeState, dispatchCode] = useReducer(codeReducer, {
        value: '',
        isValid: null,
      });

    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const numberInputRef = useRef();
    const nameInputRef = useRef();
    const dateInputRef = useRef();
    const codeInputRef = useRef();
  
    useEffect(() => {
      console.log('EFFECT RUNNING');
  
      return () => {
        console.log('EFFECT CLEANUP');
      };
    }, []);
  
    const { isValid: numberIsValid } = numberState;
    const { isValid: nameIsValid } = nameState;
    const { isValid: dateIsValid } = dateState;
    const { isValid: codeIsValid } = codeState;
  
  
  
    useEffect(() => {
      const identifier = setTimeout(() => {
        console.log('Checking form validity!');
        setFormIsValid(numberIsValid && nameIsValid && dateIsValid && codeIsValid);
      }, 500);
  
      return () => {
        console.log('CLEANUP');
        clearTimeout(identifier);
      };
    }, [numberIsValid, nameIsValid, dateIsValid, codeIsValid]);
  
    const numberChangeHandler = (event) => {
     // console.log(event.target.value);
      dispatchNumber({ type: 'USER_INPUT', val: event.target.value });
  
      // setFormIsValid(
      //   event.target.value.includes('@') && passwordState.isValid
      // );
    };
  
    const nameChangeHandler = (event) => {
      dispatchName ({ type: 'USER_INPUT', val: event.target.value });
  
      // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
    };

    const dateChangeHandler = (event) => {
        dispatchDate ({ type: 'USER_INPUT', val: event.target.value });
    
        // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
      };

      const codeChangeHandler = (event) => {
        dispatchCode ({ type: 'USER_INPUT', val: event.target.value });
    
        // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
      };
  
    const validateNumberHandler = () => {
      dispatchNumber({ type: 'INPUT_BLUR' });
    };
  
    const validateNameHandler = () => {
      dispatchName({ type: 'INPUT_BLUR' });
    };
    const validateDateHandler = () => {
        dispatchDate({ type: 'INPUT_BLUR' });
      };
      const validateCodeHandler = () => {
        dispatchCode({ type: 'INPUT_BLUR' });
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
      
     if(formIsValid){
     
      const requestConfig = {
        url: 'http://localhost:5000/verification',
        method: "POST",
        body: JSON.stringify({
          email:authCtx.user.email,
          number: numberState.value,
          name: nameState.value,
          expiration_date: dateState.value,
          security_code: codeState.value,
        
        }
        ),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
       
        
      };

      //token:true-znaci da ocekuje da nam ga server napravi.

      const data = await sendRequest(requestConfig);
     
      //u data je ono sto server posalje kao odgovor(u firebase salje name)
  
     
  
      if(data.result === 'ERROR'){//promeniti u skladu sa odg sa servera
       
       //nije uspesno logovanje
        setInfoData({
          title:  "Error",
          message: "Error ",
        });
         history.replace("/verification");
        
       
       
        }
        else{
       //za sada ce to biti neki token, kasnije ce to biti 
        authCtx.verify();
       setInfoData({
        title:  "Success",
        message: "1$ has been successfully deducted from your card!",
      });
     
      history.replace("/");
        }

       
      
    }

  
   
    else if (!numberIsValid) {
      numberInputRef.current.focus();
    }
    else if (!nameIsValid) {
      nameInputRef.current.focus();
    }
    else if (!dateIsValid) {
        dateInputRef.current.focus();
      }
      else if (!codeIsValid) {
        codeInputRef.current.focus();
      }
  }


  
    return (
      <Card className={classes.login}>
     {isLoading && <Modal/>}
       {infoData && (
        <InfModal
          title={infoData.title}
          message={infoData.message}
          onConfirm={infoData.title === "Error" ?  hideErrorModalHandler : hideSuccessModalHandler}
        />
      )}
        <form onSubmit={submitHandler}>
          <Input
            ref={numberInputRef}
            id="number"
            label="Number"
            type="number"
            isValid={numberIsValid}
            value={numberState.value}
            onChange={numberChangeHandler}
            onBlur={validateNumberHandler}
          />
          <Input
            ref={nameInputRef}
            id="name"
            label="Name"
            type="text"
            isValid={nameIsValid}
            value={nameState.value}
            onChange={nameChangeHandler}
            onBlur={validateNameHandler}
          />
           <Input
            ref={dateInputRef}
            id="date"
            label="Date"
            type="date"
            isValid={dateIsValid}
            value={dateState.value}
            onChange={dateChangeHandler}
            onBlur={validateDateHandler}
          />
           <Input
            ref={codeInputRef}
            id="code"
            label="Code"
            type="text"
            isValid={codeIsValid}
            value={codeState.value}
            onChange={codeChangeHandler}
            onBlur={validateCodeHandler}
          />
          <div className={classes.actions}>
            <Button type="submit" className={classes.btn}>
              Verify
            </Button>
          </div>
        </form>
      </Card>
    );
  };
  
  export default VerificationForm;
  