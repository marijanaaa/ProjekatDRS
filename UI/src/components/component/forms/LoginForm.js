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
  const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.includes('@') };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.includes('@') };
    }
    return { value: '', isValid: false };
  };
  
  const passwordReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 6 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 6 };
    }
    return { value: '', isValid: false };
  };
  
  const LoginForm = (props) => {
    
    
    const { isLoading, sendRequest } = useHttp();
    
    const [infoData, setInfoData] = useState(null);

    const [formIsValid, setFormIsValid] = useState(false);
  

    
    


   
     
  
    

    const [emailState, dispatchEmail] = useReducer(emailReducer, {
      value: '',
      isValid: null,
    });
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
      value: '',
      isValid: null,
    });
  
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const emailInputRef = useRef();
    const passwordInputRef = useRef();
  
    useEffect(() => {
      console.log('EFFECT RUNNING');
  
      return () => {
        console.log('EFFECT CLEANUP');
      };
    }, []);
  
    const { isValid: emailIsValid } = emailState;
    const { isValid: passwordIsValid } = passwordState;
  
    useEffect(() => {
      const identifier = setTimeout(() => {
        console.log('Checking form validity!');
        setFormIsValid(emailIsValid && passwordIsValid);
      }, 500);
  
      return () => {
        console.log('CLEANUP');
        clearTimeout(identifier);
      };
    }, [emailIsValid, passwordIsValid]);
  
    const emailChangeHandler = (event) => {
     
      dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
  
     
    };
  
    const passwordChangeHandler = (event) => {
      dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
  
     
    };
  
    const validateEmailHandler = () => {
      dispatchEmail({ type: 'INPUT_BLUR' });
    };
  
    const validatePasswordHandler = () => {
      dispatchPassword({ type: 'INPUT_BLUR' });
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
      
     if(formIsValid){
     
      const requestConfig = {
        url: 'http://localhost:5000/login',
        method: "POST",
        body: JSON.stringify({
          email:emailState.value,
          password: passwordState.value,
         
          token: true,

        }
        ),
        headers: {
          "Content-Type": "application/json"
        },
       
        
      };

      

      const data = await sendRequest(requestConfig);
     
   
  
      var count = Object.keys(data).length; 

      if(count !== 0 ){
       
        authCtx.login(data); 
      
       
       
        }
        else{
            setInfoData({
            title:  "Error",
            message: "You entered the wrong email or password!",
          });
           }

       
      
    }

  
   
    else if (!emailIsValid) {
      emailInputRef.current.focus();
    }
    else if (!passwordIsValid) {
      passwordInputRef.current.focus();
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
            ref={emailInputRef}
            id="email"
            label="E-Mail"
            type="email"
            isValid={emailIsValid}
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
          <Input
            ref={passwordInputRef}
            id="password"
            label="Password"
            type="password"
            isValid={passwordIsValid}
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
          <div className={classes.actions}>
            <Button type="submit" className={classes.btn}>
              Login
            </Button>
          </div>
        </form>
      </Card>
    );
  };
  
  export default LoginForm;
  